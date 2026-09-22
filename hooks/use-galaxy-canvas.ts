"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ViewportCamera, MemoryStar } from "@/types/galaxy";
import { MEMORY_STARS, CONSTELLATIONS } from "@/data/memories";
import { createBackgroundStars, renderGalaxy } from "@/lib/galaxy-renderer";
import { lerp, clamp } from "@/lib/math";

const DISCOVERED_STARS_KEY = "mdt_discovered_stars";

export function useGalaxyCanvas(options?: { enablePinchZoom?: boolean }) {
  const enablePinchZoom = options?.enablePinchZoom ?? false;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedStar, setSelectedStar] = useState<MemoryStar | null>(null);
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
  const [activeConstellationId, setActiveConstellationId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [discoveredStars, setDiscoveredStars] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DISCOVERED_STARS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setDiscoveredStars(parsed);
        }
      }
    } catch {}
  }, []);

  const cameraRef = useRef<ViewportCamera>({
    x: 0,
    y: 0,
    zoom: 1,
    targetX: 0,
    targetY: 0,
    targetZoom: 1,
    rotationX: 0.15,
    rotationY: 0,
    targetRotationX: 0.15,
    targetRotationY: 0,
  });

  const projectedStarsRef = useRef<
    { star: MemoryStar; screenX: number; screenY: number; radius: number }[]
  >([]);

  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMouseDownRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(true);

  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchZoomRef = useRef<number>(1);

  const focusStar = useCallback((star: MemoryStar) => {
    setSelectedStar(star);
    setDiscoveredStars((prev) => {
      if (prev.includes(star.id)) return prev;
      const updated = [...prev, star.id];
      try {
        window.localStorage.setItem(DISCOVERED_STARS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const targetRotY = -Math.atan2(star.x, star.z);
    const targetRotX = 0.1;

    cameraRef.current.targetRotationY = targetRotY;
    cameraRef.current.targetRotationX = targetRotX;
    cameraRef.current.targetZoom = 1.35;
    autoRotateRef.current = false;
  }, []);

  const resetView = useCallback(() => {
    cameraRef.current.targetX = 0;
    cameraRef.current.targetY = 0;
    cameraRef.current.targetZoom = 1;
    cameraRef.current.targetRotationX = 0.15;
    cameraRef.current.targetRotationY = 0;
    setActiveConstellationId(null);
    setSelectedStar(null);
    autoRotateRef.current = true;
  }, []);

  const zoomIn = useCallback(() => {
    cameraRef.current.targetZoom = clamp(cameraRef.current.targetZoom + 0.25, 0.6, 2.5);
  }, []);

  const zoomOut = useCallback(() => {
    cameraRef.current.targetZoom = clamp(cameraRef.current.targetZoom - 0.25, 0.6, 2.5);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const bgStars = createBackgroundStars(500);
    let startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const cam = cameraRef.current;

      if (autoRotateRef.current && !isMouseDownRef.current) {
        cam.targetRotationY += 0.0008;
      }

      cam.x = lerp(cam.x, cam.targetX, 0.08);
      cam.y = lerp(cam.y, cam.targetY, 0.08);
      cam.zoom = lerp(cam.zoom, cam.targetZoom, 0.08);
      cam.rotationX = lerp(cam.rotationX, cam.targetRotationX, 0.08);
      cam.rotationY = lerp(cam.rotationY, cam.targetRotationY, 0.08);

      const renderResult = renderGalaxy(
        ctx,
        width,
        height,
        elapsed,
        cam,
        bgStars,
        MEMORY_STARS,
        CONSTELLATIONS,
        hoveredStarId,
        activeConstellationId,
        discoveredStars
      );

      projectedStarsRef.current = renderResult.projectedStars;
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredStarId, activeConstellationId, discoveredStars]);

  const handlePointerDown = (e: React.PointerEvent) => {
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (enablePinchZoom && activePointersRef.current.size === 2) {
      const points = Array.from(activePointersRef.current.values());
      initialPinchDistRef.current = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      initialPinchZoomRef.current = cameraRef.current.targetZoom;
      isMouseDownRef.current = false;
      setIsDragging(false);
      return;
    }

    if (activePointersRef.current.size === 1) {
      isMouseDownRef.current = true;
      setIsDragging(true);
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (enablePinchZoom && activePointersRef.current.size === 2) {
      const points = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);

      if (initialPinchDistRef.current && initialPinchDistRef.current > 10) {
        const factor = dist / initialPinchDistRef.current;
        cameraRef.current.targetZoom = clamp(
          initialPinchZoomRef.current * factor,
          0.5,
          2.5
        );
      }
      return;
    }

    if (isMouseDownRef.current && activePointersRef.current.size === 1) {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;

      cameraRef.current.targetRotationY += dx * 0.005;
      cameraRef.current.targetRotationX = clamp(
        cameraRef.current.targetRotationX - dy * 0.005,
        -Math.PI / 2.3,
        Math.PI / 2.3
      );

      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    let foundStar: MemoryStar | null = null;
    const hitPadding = 18;

    for (const item of projectedStarsRef.current) {
      const dist = Math.hypot(e.clientX - item.screenX, e.clientY - item.screenY);
      if (dist <= item.radius + hitPadding) {
        foundStar = item.star;
        break;
      }
    }

    setHoveredStarId(foundStar ? foundStar.id : null);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);

    if (activePointersRef.current.size < 2) {
      initialPinchDistRef.current = null;
    }

    if (activePointersRef.current.size === 1) {
      const remaining = activePointersRef.current.values().next().value;
      if (remaining) {
        lastMouseRef.current = { x: remaining.x, y: remaining.y };
      }
    }

    const moved = Math.hypot(
      e.clientX - lastMouseRef.current.x,
      e.clientY - lastMouseRef.current.y
    );

    if (moved < 5 && activePointersRef.current.size === 0) {
      for (const item of projectedStarsRef.current) {
        const dist = Math.hypot(e.clientX - item.screenX, e.clientY - item.screenY);
        if (dist <= item.radius + 18) {
          focusStar(item.star);
          break;
        }
      }
    }

    if (activePointersRef.current.size === 0) {
      isMouseDownRef.current = false;
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!enablePinchZoom) return;
    const delta = e.deltaY * -0.001;
    cameraRef.current.targetZoom = clamp(cameraRef.current.targetZoom + delta, 0.5, 2.5);
  };

  return {
    canvasRef,
    selectedStar,
    setSelectedStar,
    hoveredStarId,
    activeConstellationId,
    setActiveConstellationId,
    isDragging,
    isAudioPlaying,
    setIsAudioPlaying,
    discoveredStars,
    focusStar,
    resetView,
    zoomIn,
    zoomOut,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
