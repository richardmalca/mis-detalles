"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const colors = [
    "#8a5a3c",
    "#c9a072",
    "#70442c",
    "#d8b28a",
    "#5c341f",
    "#b88e63",
    "#9e6b47",
    "#dfbe99",
    "#8a5a3c",
    "#caa174",
    "#6c4028",
  ];

  const bandHeight = canvas.height / colors.length;

  for (let i = 0; i < colors.length; i++) {
    const y = i * bandHeight;
    const grad = ctx.createLinearGradient(0, y, 0, y + bandHeight);
    grad.addColorStop(0, colors[i]);
    grad.addColorStop(0.5, colors[(i + 1) % colors.length]);
    grad.addColorStop(1, colors[i]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, canvas.width, bandHeight);
  }

  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
    const h = 2 + Math.random() * 6;
    const y = Math.random() * canvas.height;
    ctx.fillRect(0, y, canvas.width, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#1e4d79";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const landColors = ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#d8f3dc"];

  for (let i = 0; i < 28; i++) {
    const cx = Math.random() * canvas.width;
    const cy = 40 + Math.random() * (canvas.height - 80);
    const rad = 25 + Math.random() * 55;

    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, rad);
    grad.addColorStop(0, landColors[Math.floor(Math.random() * landColors.length)]);
    grad.addColorStop(0.7, "#2b6ca3");
    grad.addColorStop(1, "transparent");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

interface SolarPlanetProps {
  name: string;
  initialPos: [number, number, number];
  size: number;
  baseColor: string;
  texture?: THREE.CanvasTexture;
  roughness?: number;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
  ring?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
    opacity: number;
    tiltX: number;
    tiltZ: number;
  };
  spinSpeed: number;
}

function SolarPlanet({
  initialPos,
  size,
  baseColor,
  texture,
  roughness = 0.7,
  hasAtmosphere,
  atmosphereColor = "#93c5fd",
  ring,
  spinSpeed,
}: SolarPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const baseZ = initialPos[2];

  useFrame(({ camera }, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * spinSpeed;
    }

    if (groupRef.current) {
      const distanceFactor = Math.abs(baseZ);
      const parallax = (camera.position.z - 5) * (18 / distanceFactor);
      groupRef.current.position.z = baseZ + parallax * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={initialPos}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={baseColor}
          map={texture || null}
          roughness={roughness}
          metalness={0.1}
        />
      </mesh>

      {hasAtmosphere && (
        <mesh>
          <sphereGeometry args={[size * 1.1, 32, 32]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.22}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {ring && (
        <mesh rotation={[ring.tiltX, 0, ring.tiltZ]}>
          <ringGeometry args={[size * ring.innerRadius, size * ring.outerRadius, 64]} />
          <meshStandardMaterial
            color={ring.color}
            side={THREE.DoubleSide}
            transparent
            opacity={ring.opacity}
            roughness={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

export function Planets() {
  const earthTex = useMemo(() => (typeof window !== "undefined" ? createEarthTexture() : undefined), []);
  const jupiterTex = useMemo(() => (typeof window !== "undefined" ? createJupiterTexture() : undefined), []);

  return (
    <>
      <directionalLight position={[18, 12, 10]} intensity={1.8} color="#fff8e7" />
      <ambientLight intensity={0.12} />

      <SolarPlanet
        name="Tierra"
        initialPos={[-5.8, 1.8, -16]}
        size={1.0}
        baseColor="#2b6ca3"
        texture={earthTex}
        roughness={0.55}
        hasAtmosphere={true}
        atmosphereColor="#60a5fa"
        spinSpeed={0.06}
      />

      <SolarPlanet
        name="Marte"
        initialPos={[5.5, -2.2, -26]}
        size={0.9}
        baseColor="#c1440e"
        roughness={0.95}
        spinSpeed={0.055}
      />

      <SolarPlanet
        name="Júpiter"
        initialPos={[-8.5, -3.2, -42]}
        size={3.2}
        baseColor="#c9a072"
        texture={jupiterTex}
        roughness={0.65}
        spinSpeed={0.16}
      />

      <SolarPlanet
        name="Saturno"
        initialPos={[7.8, 3.0, -58]}
        size={2.4}
        baseColor="#e3c16f"
        roughness={0.7}
        ring={{
          innerRadius: 1.45,
          outerRadius: 2.35,
          color: "#d4af37",
          opacity: 0.65,
          tiltX: THREE.MathUtils.degToRad(27),
          tiltZ: THREE.MathUtils.degToRad(12),
        }}
        spinSpeed={0.13}
      />

      <SolarPlanet
        name="Urano"
        initialPos={[-5.2, 4.0, -74]}
        size={1.4}
        baseColor="#a8e0e6"
        roughness={0.6}
        ring={{
          innerRadius: 1.3,
          outerRadius: 1.5,
          color: "#c7f0f4",
          opacity: 0.4,
          tiltX: THREE.MathUtils.degToRad(98),
          tiltZ: 0,
        }}
        spinSpeed={0.09}
      />

      <SolarPlanet
        name="Neptuno"
        initialPos={[6.5, -3.8, -90]}
        size={1.6}
        baseColor="#3457a6"
        roughness={0.6}
        spinSpeed={0.08}
      />
    </>
  );
}
