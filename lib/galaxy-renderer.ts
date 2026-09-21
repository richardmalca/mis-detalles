import { Constellation, MemoryStar, ViewportCamera } from "@/types/galaxy";
import { project3D } from "./math";

export interface BackgroundStar {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

export function createBackgroundStars(count: number = 450): BackgroundStar[] {
  const stars: BackgroundStar[] = [];
  const colors = ["#ffffff", "#e0e7ff", "#fef3c7", "#fce7f3", "#bae6fd"];

  for (let i = 0; i < count; i++) {
    const radius = 250 + Math.random() * 850;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    stars.push({
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
      size: 0.7 + Math.random() * 1.5,
      baseAlpha: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 1 + Math.random() * 3,
      twinklePhase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return stars;
}

export function renderGalaxy(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  camera: ViewportCamera,
  backgroundStars: BackgroundStar[],
  memoryStars: MemoryStar[],
  constellations: Constellation[],
  hoveredStarId: string | null,
  activeConstellationId: string | null
): { projectedStars: { star: MemoryStar; screenX: number; screenY: number; radius: number }[] } {
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2 + camera.x;
  const cy = height / 2 + camera.y;

  const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(width, height) * 0.85);
  bgGrad.addColorStop(0, "#0a0e27");
  bgGrad.addColorStop(0.35, "#060919");
  bgGrad.addColorStop(0.7, "#030611");
  bgGrad.addColorStop(1, "#010207");

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const nebGrad1 = ctx.createRadialGradient(cx - 160, cy - 120, 20, cx - 160, cy - 120, 380);
  nebGrad1.addColorStop(0, "rgba(236, 72, 153, 0.12)");
  nebGrad1.addColorStop(0.5, "rgba(168, 85, 247, 0.05)");
  nebGrad1.addColorStop(1, "transparent");
  ctx.fillStyle = nebGrad1;
  ctx.fillRect(0, 0, width, height);

  const nebGrad2 = ctx.createRadialGradient(cx + 200, cy + 100, 30, cx + 200, cy + 100, 420);
  nebGrad2.addColorStop(0, "rgba(59, 130, 246, 0.14)");
  nebGrad2.addColorStop(0.6, "rgba(234, 179, 8, 0.04)");
  nebGrad2.addColorStop(1, "transparent");
  ctx.fillStyle = nebGrad2;
  ctx.fillRect(0, 0, width, height);

  for (const bgStar of backgroundStars) {
    const proj = project3D(bgStar, camera.rotationX, camera.rotationY, camera.zoom);
    const sx = cx + proj.x;
    const sy = cy + proj.y;

    if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

    const twinkle = Math.sin(time * bgStar.twinkleSpeed + bgStar.twinklePhase) * 0.35 + 0.65;
    const alpha = bgStar.baseAlpha * proj.alpha * twinkle;

    ctx.save();
    ctx.globalAlpha = Math.max(0.1, Math.min(alpha, 1));
    ctx.fillStyle = bgStar.color;
    ctx.beginPath();
    ctx.arc(sx, sy, bgStar.size * proj.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const projectedMemoryStars: {
    star: MemoryStar;
    screenX: number;
    screenY: number;
    radius: number;
    scale: number;
    alpha: number;
  }[] = [];

  const starMap = new Map<string, { x: number; y: number; alpha: number }>();

  for (const star of memoryStars) {
    const proj = project3D(star, camera.rotationX, camera.rotationY, camera.zoom);
    const sx = cx + proj.x;
    const sy = cy + proj.y;
    const radius = star.size * proj.scale;

    projectedMemoryStars.push({
      star,
      screenX: sx,
      screenY: sy,
      radius,
      scale: proj.scale,
      alpha: proj.alpha,
    });

    starMap.set(star.id, { x: sx, y: sy, alpha: proj.alpha });
  }

  for (const constellation of constellations) {
    const isFocused = activeConstellationId === constellation.id;
    const isAnyActive = Boolean(activeConstellationId);

    ctx.save();
    ctx.beginPath();
    let hasMoved = false;

    for (const starId of constellation.stars) {
      const pos = starMap.get(starId);
      if (!pos) continue;

      if (!hasMoved) {
        ctx.moveTo(pos.x, pos.y);
        hasMoved = true;
      } else {
        ctx.lineTo(pos.x, pos.y);
      }
    }

    if (isFocused) {
      ctx.strokeStyle = constellation.accentColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = constellation.accentColor;
      ctx.shadowBlur = 14;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -time * 15;
    } else if (isAnyActive) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = constellation.color;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
    }

    ctx.stroke();
    ctx.restore();
  }

  for (const item of projectedMemoryStars) {
    const { star, screenX, screenY, radius, alpha } = item;
    const isHovered = hoveredStarId === star.id;
    const isInActiveConstellation =
      activeConstellationId && star.constellationId === activeConstellationId;

    const pulse = Math.sin(time * star.pulseSpeed) * 0.35 + 1;
    const actualRadius = (isHovered ? radius * 1.6 : radius) * (isInActiveConstellation ? 1.3 : 1);

    ctx.save();

    const haloRadius = actualRadius * (isHovered ? 5.5 : 3.8) * pulse;
    const haloGrad = ctx.createRadialGradient(screenX, screenY, actualRadius * 0.5, screenX, screenY, haloRadius);
    haloGrad.addColorStop(0, star.glowColor);
    haloGrad.addColorStop(1, "transparent");

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(screenX, screenY, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isHovered ? "#ffffff" : star.color;
    ctx.shadowColor = star.color;
    ctx.shadowBlur = isHovered ? 24 : 14;
    ctx.beginPath();
    ctx.arc(screenX, screenY, actualRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(screenX, screenY, actualRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    if (isHovered || isInActiveConstellation) {
      ctx.shadowBlur = 0;
      ctx.font = "600 13px system-ui, -apple-system, sans-serif";
      const text = star.title;
      const metrics = ctx.measureText(text);
      const paddingX = 10;
      const paddingY = 5;
      const tagHeight = 22;
      const tagWidth = metrics.width + paddingX * 2;
      const tagX = screenX - tagWidth / 2;
      const tagY = screenY - actualRadius - 28;

      ctx.fillStyle = "rgba(9, 9, 11, 0.88)";
      ctx.strokeStyle = isHovered ? star.color : "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f4f4f5";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, screenX, tagY + tagHeight / 2);
    }

    ctx.restore();
  }

  return {
    projectedStars: projectedMemoryStars.map((p) => ({
      star: p.star,
      screenX: p.screenX,
      screenY: p.screenY,
      radius: p.radius,
    })),
  };
}
