import clsx from "clsx";

const sizeClasses = {
  sm: "min-h-8 min-w-[64px] px-3 text-xs",
  md: "min-h-9 min-w-[72px] px-3.5 text-sm",
};

export default function ThemeToggle({
  theme = "dark",
  onChange,
  size = "sm",
  className,
}) {
  const resolvedSize = sizeClasses[size] || sizeClasses.sm;

  const segmentClass = (target) => {
    const active = theme === target;
    return clsx(
      "rounded-xl border font-extrabold uppercase tracking-[0.08em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70",
      resolvedSize,
      active &&
        target === "light" &&
        "bg-white text-slate-900 border-slate-200 shadow-[0_6px_16px_rgba(15,23,42,0.18)]",
      active &&
        target === "dark" &&
        "bg-slate-900 text-white border-slate-700 shadow-[0_6px_16px_rgba(2,6,23,0.35)]",
      !active &&
        theme === "dark" &&
        "bg-white/10 text-white/85 border-white/20 hover:bg-white/20 hover:border-white/35",
      !active &&
        theme === "light" &&
        "bg-slate-200/75 text-slate-600 border-slate-300 hover:bg-white hover:text-slate-800"
    );
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 rounded-2xl border p-1 backdrop-blur-md shadow-[0_12px_26px_rgba(15,23,42,0.16)]",
        theme === "dark"
          ? "border-white/30 bg-black/20"
          : "border-slate-300/90 bg-white/80",
        className
      )}
    >
      <button
        type="button"
        aria-label="Switch to light theme"
        aria-pressed={theme === "light"}
        onClick={() => onChange?.("light")}
        className={segmentClass("light")}
      >
        Light
      </button>
      <button
        type="button"
        aria-label="Switch to dark theme"
        aria-pressed={theme === "dark"}
        onClick={() => onChange?.("dark")}
        className={segmentClass("dark")}
      >
        Dark
      </button>
    </div>
  );
}
