export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  alpha: number;
}

export function project3D(
  point: Point3D,
  cameraRotationX: number,
  cameraRotationY: number,
  zoom: number,
  focalLength: number = 700
): ProjectedPoint {
  const cosY = Math.cos(cameraRotationY);
  const sinY = Math.sin(cameraRotationY);
  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;

  const cosX = Math.cos(cameraRotationX);
  const sinX = Math.sin(cameraRotationX);
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  const distance = focalLength + z2;
  const safeDistance = Math.max(distance, 50);
  const perspective = (focalLength / safeDistance) * zoom;

  const alpha = Math.min(Math.max((z2 + 400) / 700, 0.25), 1);

  return {
    x: x1 * perspective,
    y: y2 * perspective,
    scale: perspective,
    alpha,
  };
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
