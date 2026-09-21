"use client";

interface AnimatedFlowerProps {
  size?: number;
  petalColor?: string;
  petalColorAlt?: string;
  centerColor?: string;
  delay?: number;
  swayDuration?: number;
}

export function AnimatedFlower({
  size = 72,
  petalColor = "#facc15",
  petalColorAlt = "#eab308",
  centerColor = "#78350f",
  delay = 0,
  swayDuration = 4.5,
}: AnimatedFlowerProps) {
  const petals = Array.from({ length: 8 });

  return (
    <div
      className="inline-block"
      style={{
        width: size,
        height: size,
        animation: `sway ${swayDuration}s ease-in-out infinite alternate`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <g style={{ transformOrigin: "50px 50px" }}>
          {petals.map((_, i) => (
            <g
              key={i}
              style={{
                transform: `rotate(${(360 / 8) * i}deg)`,
                transformOrigin: "50px 50px",
              }}
            >
              <ellipse
                cx="50"
                cy="26"
                rx="11"
                ry="20"
                fill={i % 2 === 0 ? petalColor : petalColorAlt}
                className="petal-bloom"
                style={{
                  transformOrigin: "50px 50px",
                  animationDelay: `${delay + i * 0.06}s`,
                }}
              />
            </g>
          ))}
          <circle
            cx="50"
            cy="50"
            r="13"
            fill={centerColor}
            className="petal-bloom"
            style={{ transformOrigin: "50px 50px", animationDelay: `${delay}s` }}
          />
        </g>
      </svg>
    </div>
  );
}
