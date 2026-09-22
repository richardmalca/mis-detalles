"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import { Warp } from "./warp";
import { Core } from "./core";
import { Planets } from "./planets";

function ResponsiveCamera() {
  useFrame(({ camera, size }) => {
    const isMobile = size.width < 768;
    const isPortrait = size.height > size.width;
    const targetFov = isPortrait ? (isMobile ? 85 : 80) : 70;
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - targetFov) > 0.5) {
      cam.fov = targetFov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

export function UniverseCanvas({
  speedRef,
  coreIntensityRef,
}: {
  speedRef: MutableRefObject<number>;
  coreIntensityRef: MutableRefObject<number>;
}) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <ResponsiveCamera />
        <color attach="background" args={["#04010c"]} />
        <fog attach="fog" args={["#04010c", 8, 60]} />
        <ambientLight intensity={0.25} />
        <Warp speedRef={speedRef} />
        <Planets />
        <Core intensityRef={coreIntensityRef} />
      </Canvas>
    </div>
  );
}
