"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const SPREAD = 55;
const DEPTH = 90;

const PALETTE = ["#ffe066", "#ffd23f", "#fff2b2", "#ffffff", "#ffb703"];

function getParticleCount() {
  if (typeof window === "undefined") return 2600;
  return window.innerWidth < 768 ? 1200 : 2600;
}

export function Warp({ speedRef }: { speedRef: MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const countRef = useRef(getParticleCount());

  const { positions, colors } = useMemo(() => {
    const count = countRef.current;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = PALETTE.map((hex) => new THREE.Color(hex));

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 2] = -Math.random() * DEPTH;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const pos = points.geometry.attributes.position as THREE.BufferAttribute;
    const speed = speedRef.current;
    const clampedDelta = Math.min(delta, 0.05);

    for (let i = 0; i < countRef.current; i++) {
      let z = pos.getZ(i) + clampedDelta * speed * 14;
      if (z > 5) {
        z = -DEPTH;
        pos.setX(i, (Math.random() - 0.5) * SPREAD);
        pos.setY(i, (Math.random() - 0.5) * SPREAD);
      }
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    points.rotation.z += clampedDelta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  );
}
