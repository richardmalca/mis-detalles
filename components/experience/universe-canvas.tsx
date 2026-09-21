"use client";

import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { Warp } from "./warp";
import { Core } from "./core";
import { Planets } from "./planets";

export function UniverseCanvas({
  speedRef,
  coreIntensityRef,
}: {
  speedRef: MutableRefObject<number>;
  coreIntensityRef: MutableRefObject<number>;
}) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
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
