"use client";

interface HealthIndicatorProps {
  rating: "strong" | "typical" | "concerning";
  size?: "sm" | "md";
}

const ratingConfig = {
  strong: {
    color: "bg-emerald-500",
    ring: "ring-emerald-200",
    label: "Strong",
  },
  typical: {
    color: "bg-amber-400",
    ring: "ring-amber-200",
    label: "Typical",
  },
  concerning: {
    color: "bg-red-500",
    ring: "ring-red-200",
    label: "Watch",
  },
};

export function HealthIndicator({ rating, size = "sm" }: HealthIndicatorProps) {
  const config = ratingConfig[rating];
  const dotSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <div className="flex items-center gap-1.5" title={config.label}>
      <span
        className={`${dotSize} rounded-full ${config.color} ring-2 ${config.ring}`}
      />
    </div>
  );
}
