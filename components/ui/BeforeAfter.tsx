"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { MoveHorizontal } from "lucide-react";

type BeforeAfterProps = {
  image?: string;
  before?: string;
  after?: string;
  alt?: string;
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

export function BeforeAfter({
  image,
  before,
  after,
  alt,
  title,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayAlt = alt || title || "Smile transformation";
  const beforeImg = before || image || "";
  const afterImg = after || image || "";
  const isDifferentImages = Boolean(before && after);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 4));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 4));
    }
  };

  return (
    <div
      ref={ref}
      className={`group relative aspect-[16/11] w-full touch-none select-none overflow-hidden rounded-[1.75rem] border border-ink/10 shadow-card ${className ?? ""}`}
      onPointerDown={(e) => {
        setDragging(true);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging && update(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      {/* After (full colour) */}
      <img
        src={afterImg}
        alt={`${displayAlt} — ${afterLabel.toLowerCase()}`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <span className="absolute right-4 top-4 rounded-full bg-brand-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        {afterLabel}
      </span>

      {/* Before (filtered or distinct before photo, clipped to the left of the handle) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={beforeImg}
          alt={`${displayAlt} — ${beforeLabel.toLowerCase()}`}
          className="absolute inset-0 h-full w-full object-cover"
          style={
            isDifferentImages
              ? undefined
              : {
                  filter: "saturate(0.55) brightness(0.86) sepia(0.4) contrast(0.92)",
                }
          }
          draggable={false}
        />
        <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          role="slider"
          onKeyDown={onKeyDown}
          className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-ink/10 bg-white text-brand-700 shadow-lift transition-transform group-hover:scale-105"
        >
          <MoveHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
