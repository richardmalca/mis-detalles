"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function RevealSection({
  children,
  className = "",
  onVisible,
}: {
  children: ReactNode;
  className?: string;
  onVisible?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          onVisible?.();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={ref}
      className={`flex min-h-[90vh] items-center justify-center px-6 py-12 text-center transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </div>
  );
}
