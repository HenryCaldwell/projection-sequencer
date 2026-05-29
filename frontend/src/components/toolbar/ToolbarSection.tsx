import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

function ToolbarSection({
  icon: Icon,
  label,
  open,
  onToggle,
  children,
}: Props) {
  return (
    <div
      className={`flex flex-row h-full shrink-0 border-l border-white/5 first:border-l-0 ${open ? "flex-1" : ""}`}
    >
      <div
        onClick={onToggle}
        className={`w-15 shrink-0 flex flex-col items-center justify-center cursor-pointer select-none gap-2.5 py-3 transition-colors duration-150 ${open ? "bg-white/3" : ""}`}
      >
        <Icon
          size={14}
          className={open ? "text-neutral-500" : "text-neutral-700"}
        />
        <span
          className={`text-xs tracking-widest uppercase whitespace-nowrap transition-colors duration-150 ${open ? "text-neutral-600" : "text-neutral-800"}`}
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {label}
        </span>
      </div>

      {open && (
        <div className="flex-1 min-w-0 p-3 overflow-y-auto h-full">
          {children}
        </div>
      )}
    </div>
  );
}

export default ToolbarSection;
