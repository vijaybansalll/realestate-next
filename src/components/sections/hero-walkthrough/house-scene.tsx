/* eslint-disable react-hooks/immutability */
"use client";

import {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { TOUR_STOPS, type Point } from "@/data/house-tour";
import { useTheme } from "next-themes";

const MODEL_HD = "/models/alder-house-hd.glb";
const MODEL_SD = "/models/alder-house.glb";
const DRACO = "/draco/";

// Prime the GLTF cache early in client runtime
if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_SD, DRACO);
}

interface HouseSceneProps {
  progressRef?: React.RefObject<number>;
  progress?: number;
  onRoomClick?: (slug: string) => void;
  onLoaded?: () => void;
  onFirstFrame?: () => void;
  isVisible?: boolean;
}

/** Convert house coordinates (z up, y towards the back) to Three.js coordinates (y up, z towards viewer) */
function toScene([x, y, z]: Point) {
  return new THREE.Vector3(x, z, -y);
}

function smootherstep(x: number) {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Reusable vector math instances to prevent per-frame garbage collection
const ab = new THREE.Vector3();
const ap = new THREE.Vector3();
const proj = new THREE.Vector3();
function segmentDistance(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3) {
  ab.subVectors(b, a);
  ap.subVectors(p, a);
  const abLenSq = ab.lengthSq();
  if (abLenSq === 0) return ap.length();
  const t = THREE.MathUtils.clamp(ap.dot(ab) / abLenSq, 0, 1);
  proj.copy(ab).multiplyScalar(t);
  return ap.sub(proj).length();
}

function partOf(node: THREE.Object3D): string {
  for (let n: THREE.Object3D | null = node; n; n = n.parent) {
    const match = /^(room|plant|tree|glass|roof|walls|grounds)/.exec(n.name);
    if (match) return match[1];
  }
  return "";
}

function roomOf(node: THREE.Object3D): string | null {
  for (let n: THREE.Object3D | null = node; n; n = n.parent) {
    if (n.name.startsWith("room_")) return n.name.slice("room_".length);
  }
  return null;
}

export function canShowWebGL() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HouseScene({
  progressRef,
  progress,
  onRoomClick,
  onLoaded,
  onFirstFrame,
  isVisible = true,
}: HouseSceneProps) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const model = useMemo(() => {
    if (!isClient || !canShowWebGL()) return null;
    const isLargeScreen =
      window.innerWidth * Math.min(window.devicePixelRatio, 2) >= 2000 &&
      !window.matchMedia("(pointer: coarse)").matches;
    return isLargeScreen ? MODEL_HD : MODEL_SD;
  }, [isClient]);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const skyColor = isDark ? "#09090b" : "#dfe6e4";
  const lawnColor = isDark ? "#172319" : "#8aa36a";

  if (!model) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      <Canvas
        flat
        dpr={[1, 1.75]}
        camera={{ fov: 38, near: 0.5, far: 300, position: [-1, 3.2, 16] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        aria-hidden="true"
        className="w-full h-full"
      >
        <color attach="background" args={[skyColor]} />
        <fog attach="fog" args={[skyColor, 32, 100]} />
        <Suspense fallback={null}>
          <HouseModel
            model={model}
            progressRef={progressRef}
            progress={progress}
            onRoomClick={onRoomClick}
            lawnColor={lawnColor}
            isDark={isDark}
            onLoaded={onLoaded}
            onFirstFrame={onFirstFrame}
            isVisible={isVisible}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface HouseModelProps {
  model: string;
  progressRef?: React.RefObject<number>;
  progress?: number;
  onRoomClick?: (slug: string) => void;
  lawnColor: string;
  isDark: boolean;
  onLoaded?: () => void;
  onFirstFrame?: () => void;
  isVisible: boolean;
}

function HouseModel({
  model,
  progressRef,
  progress = 0,
  onRoomClick,
  lawnColor,
  isDark,
  onLoaded,
  onFirstFrame,
  isVisible,
}: HouseModelProps) {
  const { scene } = useGLTF(model, DRACO);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const currentPos = useRef(0);
  const roof = useRef<THREE.Object3D | null>(null);
  const roofMaterial = useRef<THREE.MeshBasicMaterial | null>(null);
  const eye = useMemo(() => new THREE.Vector3(), []);
  const drift = useMemo(() => new THREE.Vector2(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const prevEye = useRef(new THREE.Vector3());
  const prevLook = useRef(new THREE.Vector3());
  const trees = useRef<{ mesh: THREE.Object3D; centre: THREE.Vector3; radius: number }[]>([]);
  const hasRenderedFirstFrame = useRef(false);

  const anchors = useMemo(() => {
    return TOUR_STOPS.map((stop) => ({
      camera: toScene(stop.camera),
      target: toScene(stop.target),
    }));
  }, []);

  useLayoutEffect(() => {
    scene.updateMatrixWorld(true);
    trees.current = [];
    const maxAnisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 4);

    scene.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const source = node.material as THREE.MeshStandardMaterial;
      const map = source?.map;
      if (map) {
        map.anisotropy = maxAnisotropy;
      }

      const kind = partOf(node);
      let material: THREE.MeshBasicMaterial;

      if (kind === "glass") {
        material = new THREE.MeshBasicMaterial({
          color: isDark ? "#8cb4c4" : "#dfeaec",
          transparent: true,
          opacity: isDark ? 0.28 : 0.2,
          depthWrite: false,
        });
      } else if (kind === "tree" || kind === "plant") {
        material = new THREE.MeshBasicMaterial({
          map,
          alphaTest: 0.5,
          side: THREE.DoubleSide,
          color: kind === "plant" ? (isDark ? "#a2aba0" : "#b9b4a8") : "#ffffff",
        });
      } else {
        material = new THREE.MeshBasicMaterial({ map });
      }

      if (kind === "roof") {
        material.transparent = true;
        roof.current = node;
        roofMaterial.current = material;
      }

      if (kind === "tree") {
        node.geometry.computeBoundingSphere();
        if (node.geometry.boundingSphere) {
          const sphere = node.geometry.boundingSphere.clone().applyMatrix4(node.matrixWorld);
          trees.current.push({ mesh: node, centre: sphere.center, radius: sphere.radius });
        }
      }

      node.material = material;
    });

    onLoaded?.();
  }, [scene, gl, isDark, onLoaded]);

  useFrame((state, delta) => {
    // If hero walkthrough is completely off-screen, skip render work to save GPU & CPU
    if (!isVisible) return;

    if (!hasRenderedFirstFrame.current) {
      hasRenderedFirstFrame.current = true;
      onFirstFrame?.();
    }

    // Read target progress without triggering React component re-renders
    const rawProgress = progressRef ? progressRef.current : progress;
    const targetProgress = rawProgress * (anchors.length - 1);

    // Smooth dampening towards target progress
    currentPos.current = THREE.MathUtils.damp(
      currentPos.current,
      targetProgress,
      3.2,
      Math.min(delta, 0.1)
    );

    const last = anchors.length - 1;
    const p = THREE.MathUtils.clamp(currentPos.current, 0, last);
    const i = Math.min(Math.floor(p), last - 1);
    const f = smootherstep(p - i);

    eye.lerpVectors(anchors[i].camera, anchors[i + 1].camera, f);
    look.lerpVectors(anchors[i].target, anchors[i + 1].target, f);

    // Eased pointer drift for subtle 3D parallax
    drift.x = THREE.MathUtils.damp(drift.x, state.pointer.x * 0.14, 2, delta);
    drift.y = THREE.MathUtils.damp(drift.y, state.pointer.y * 0.08, 2, delta);
    eye.x += drift.x;
    eye.y += drift.y;

    camera.position.copy(eye);
    camera.lookAt(look);

    // Optimized tree occlusion check: only recalculate when camera has meaningfully moved
    if (
      prevEye.current.distanceToSquared(eye) > 0.0004 ||
      prevLook.current.distanceToSquared(look) > 0.0004
    ) {
      prevEye.current.copy(eye);
      prevLook.current.copy(look);

      for (let t = 0; t < trees.current.length; t++) {
        const tree = trees.current[t];
        tree.mesh.visible = segmentDistance(tree.centre, eye, look) > tree.radius + 0.5;
      }
    }

    // Dynamic framing centered on all screen sizes
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    cam.fov = aspect < 1 ? Math.min(68, 38 / Math.pow(aspect, 0.75)) : 38;
    cam.clearViewOffset();

    // Roof lifts off smoothly as tour begins and settles back for departure
    if (roof.current && roofMaterial.current) {
      const open = THREE.MathUtils.clamp(Math.min(p, last - p) * 1.4, 0, 1);
      roof.current.position.y = open * 4.2;
      roofMaterial.current.opacity = 1 - open;
      roof.current.visible = open < 0.99;
    }
  });

  const handlePointerDown = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      const room = roomOf(event.object);
      if (!room) return;
      event.stopPropagation();
      onRoomClick?.(room);
    },
    [onRoomClick]
  );

  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    const room = roomOf(event.object);
    document.body.style.cursor = room ? "pointer" : "";
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = "";
  }, []);

  return (
    <>
      <primitive
        object={scene}
        onClick={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      />
      {/* Extended perimeter lawn fading into horizon fog */}
      <mesh rotation-x={-Math.PI / 2} position={[8, -0.2, -5]}>
        <circleGeometry args={[240, 48]} />
        <meshBasicMaterial color={lawnColor} />
      </mesh>
    </>
  );
}
