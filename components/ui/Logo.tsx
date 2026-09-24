import { cn } from "@/utils/cn";

const TOOTH_PATH =
  "M16 4.2c-2.4 0-3.6 1.1-5.7 1.1-1 0-1.9-.3-3-.3-1.3 0-2.5.6-3.3 1.7C2.7 8.3 2.4 11 3 14.6c.4 2.5 1 4.2 1.7 7.3.5 2.2.7 5.2 1.9 6 .9.6 2-.2 2.5-1.7.8-2.4 1.1-5.6 2.5-6.7.7-.6 1.9-.6 2.6 0 1.4 1.1 1.7 4.3 2.5 6.7.5 1.5 1.6 2.3 2.5 1.7 1.2-.8 1.4-3.8 1.9-6 .7-3.1 1.3-4.8 1.7-7.3.6-3.6.3-6.3-1-7.9-.8-1.1-2-1.7-3.3-1.7-1.1 0-2 .3-3 .3-2.1 0-3.3-1.1-5.7-1.1Z";

type LogoProps = {
  className?: string;
  tone?: "light" | "dark";
  showWordmark?: boolean;
};

export function Logo({
  className,
  tone = "dark",
  showWordmark = true,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-[0.7rem] bg-gradient-to-br from-brand-400 to-brand-700 shadow-soft ring-1 ring-inset ring-white/30">
        <span
          aria-hidden
          className="absolute -right-2 -top-3 h-7 w-7 rounded-full bg-white/25 blur-md"
        />
        <svg
          viewBox="0 0 32 32"
          className="relative h-5 w-5 text-white"
          fill="currentColor"
          aria-hidden
        >
          <path d={TOOTH_PATH} />
        </svg>
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.15rem] font-semibold tracking-tight",
              tone === "light" ? "text-white" : "text-ink",
            )}
          >
            Lumina
          </span>
          <span
            className={cn(
              "text-[0.62rem] font-semibold uppercase tracking-[0.22em]",
              tone === "light" ? "text-white/60" : "text-brand-600",
            )}
          >
            Dental Studio
          </span>
        </span>
      ) : null}
    </span>
  );
}
