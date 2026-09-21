export type StarCategory = "memory" | "message" | "promise" | "constellation" | "easter-egg";

export interface MemoryStar {
  id: string;
  title: string;
  date?: string;
  category: StarCategory;
  summary: string;
  content: string;
  tag: string;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  constellationId?: string;
  isUnlocked?: boolean;
}

export interface Constellation {
  id: string;
  name: string;
  latinName: string;
  meaning: string;
  stars: string[];
  color: string;
  accentColor: string;
}

export interface ViewportCamera {
  x: number;
  y: number;
  zoom: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
  rotationX: number;
  rotationY: number;
  targetRotationX: number;
  targetRotationY: number;
}
