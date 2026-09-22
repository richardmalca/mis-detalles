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

export interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  color: string;
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
  activeConstellationId: string | null,
  discoveredStars: string[] = []
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
    ctx.save();
    ctx.globalAlpha = Math.max(0.05, Math.min(bgStar.baseAlpha * proj.alpha * twinkle, 1));
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

  const activeConstellation = constellations.find((c) => c.id === activeConstellationId);
  if (activeConstellation) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (const sid of activeConstellation.stars) {
      const pos = starMap.get(sid);
      if (pos) {
        sumX += pos.x;
        sumY += pos.y;
        count++;
      }
    }
    if (count > 0) {
      const midX = sumX / count;
      const midY = sumY / count;
      const pulseNeb = Math.sin(time * 1.5) * 15 + 160;
      const cGrad = ctx.createRadialGradient(midX, midY, 10, midX, midY, pulseNeb * 1.6);
      cGrad.addColorStop(0, activeConstellation.color.replace("0.45", "0.22"));
      cGrad.addColorStop(0.5, activeConstellation.color.replace("0.45", "0.08"));
      cGrad.addColorStop(1, "transparent");
      ctx.save();
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(midX, midY, pulseNeb * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (const constellation of constellations) {
    const isFocused = activeConstellationId === constellation.id;
    const isAnyActive = Boolean(activeConstellationId);
    const isCompleted = constellation.stars.every((sid) => discoveredStars.includes(sid));

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
      ctx.lineWidth = 2.4;
      ctx.shadowColor = constellation.accentColor;
      ctx.shadowBlur = 18;
      ctx.setLineDash([7, 5]);
      ctx.lineDashOffset = -time * 18;
    } else if (isCompleted) {
      ctx.strokeStyle = constellation.accentColor;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = constellation.accentColor;
      ctx.shadowBlur = 10;
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -time * 6;
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

    if (isFocused || isCompleted) {
      const starCoords: { x: number; y: number }[] = [];
      for (const sid of constellation.stars) {
        const p = starMap.get(sid);
        if (p) starCoords.push(p);
      }

      if (starCoords.length > 1) {
        const segCount = starCoords.length - 1;
        const speed = isFocused ? 0.35 : 0.2;
        const progress = (time * speed) % segCount;
        const segIndex = Math.floor(progress);
        const segFraction = progress - segIndex;

        const p1 = starCoords[segIndex];
        const p2 = starCoords[segIndex + 1];

        if (p1 && p2) {
          const cometX = p1.x + (p2.x - p1.x) * segFraction;
          const cometY = p1.y + (p2.y - p1.y) * segFraction;

          ctx.save();
          ctx.shadowColor = constellation.accentColor;
          ctx.shadowBlur = 14;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(cometX, cometY, isFocused ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();

          const trailGrad = ctx.createRadialGradient(cometX, cometY, 1, cometX, cometY, 12);
          trailGrad.addColorStop(0, constellation.accentColor);
          trailGrad.addColorStop(1, "transparent");
          ctx.fillStyle = trailGrad;
          ctx.beginPath();
          ctx.arc(cometX, cometY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  const shootingStarPeriod = 7;
  const shootingPhase = (time % shootingStarPeriod) / shootingStarPeriod;
  if (shootingPhase < 0.22) {
    const progress = shootingPhase / 0.22;
    const startX = width * 0.2 + (Math.sin(Math.floor(time / shootingStarPeriod)) * 100);
    const startY = height * 0.1;
    const shootDist = Math.min(width, height) * 0.45;
    const currX = startX + Math.cos(Math.PI / 4) * shootDist * progress;
    const currY = startY + Math.sin(Math.PI / 4) * shootDist * progress;
    const tailLen = 65 * (1 - progress * 0.3);

    const tailX = currX - Math.cos(Math.PI / 4) * tailLen;
    const tailY = currY - Math.sin(Math.PI / 4) * tailLen;

    ctx.save();
    const grad = ctx.createLinearGradient(tailX, tailY, currX, currY);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.7, "rgba(251, 191, 36, 0.4)");
    grad.addColorStop(1, "#ffffff");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#fef08a";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(currX, currY, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const item of projectedMemoryStars) {
    const { star, screenX, screenY, radius } = item;
    const isHovered = hoveredStarId === star.id;
    const isInActiveConstellation =
      activeConstellationId && star.constellationId === activeConstellationId;
    const isDiscovered = discoveredStars.includes(star.id);

    const pulse = Math.sin(time * star.pulseSpeed) * 0.35 + 1;
    const actualRadius = (isHovered ? radius * 1.6 : radius) * (isInActiveConstellation ? 1.3 : 1);

    ctx.save();

    const haloMult = isHovered ? 5.8 : (isDiscovered ? 4.6 : 3.6);
    const haloRadius = actualRadius * haloMult * pulse;
    const haloGrad = ctx.createRadialGradient(screenX, screenY, actualRadius * 0.4, screenX, screenY, haloRadius);
    haloGrad.addColorStop(0, isDiscovered ? "#fbbf24" : star.glowColor);
    haloGrad.addColorStop(1, "transparent");

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(screenX, screenY, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isHovered ? "#ffffff" : (isDiscovered ? "#fef08a" : star.color);
    ctx.shadowColor = isDiscovered ? "#fbbf24" : star.color;
    ctx.shadowBlur = isHovered ? 26 : (isDiscovered ? 18 : 12);
    ctx.beginPath();
    ctx.arc(screenX, screenY, actualRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(screenX, screenY, actualRadius * 0.52, 0, Math.PI * 2);
    ctx.fill();

    if (isHovered || isInActiveConstellation) {
      ctx.shadowBlur = 0;
      ctx.font = "600 13px system-ui, -apple-system, sans-serif";
      const text = isDiscovered ? `✓ ${star.title}` : star.title;
      const metrics = ctx.measureText(text);
      const paddingX = 10;
      const paddingY = 5;
      const tagHeight = 22;
      const tagWidth = metrics.width + paddingX * 2;
      const tagX = screenX - tagWidth / 2;
      const tagY = screenY - actualRadius - 28;

      ctx.fillStyle = "rgba(9, 9, 11, 0.88)";
      ctx.strokeStyle = isHovered ? (isDiscovered ? "#fbbf24" : star.color) : "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDiscovered ? "#fef08a" : "#f4f4f5";
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
