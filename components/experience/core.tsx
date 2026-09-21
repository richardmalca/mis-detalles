"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";

export function Core({ intensityRef }: { intensityRef: MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const intensity = intensityRef.current;
    const pulse = 1 + Math.sin(t * 1.6) * 0.04;

    if (meshRef.current) {
      meshRef.current.scale.setScalar(intensity * pulse);
      meshRef.current.rotation.y = t * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(intensity * 1.8 * pulse);
    }
  });

  return (
    <group position={[0, 0, -6]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffd23f" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ffe066"
          emissive="#ffb703"
          emissiveIntensity={1.5}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>
      <pointLight color="#ffd23f" intensity={4} distance={12} />
    </group>
  );
}
