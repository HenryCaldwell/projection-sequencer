import { useState } from "react";
import type { Color } from "../../lib/types";

type Props = {
  colors: Color[];
  onColorsChange: (colors: Color[]) => void;
};

function ColorPanel({ colors, onColorsChange }: Props) {
  const [activeColor, setActiveColor] = useState(colors[0].id);

  const handleColorChange = (id: string, patch: Partial<Color>) => {
    onColorsChange(
      colors.map((color) => (color.id === id ? { ...color, ...patch } : color)),
    );
  };

  return (
    <div className="flex flex-col justify-between h-full py-1">
      {colors.map((color) => {
        const isActive = activeColor === color.id;
        const tolerancePercent = ((color.tolerance - 5) / 55) * 100;

        return (
          <div
            key={color.id}
            onClick={() => setActiveColor(color.id)}
            className={`flex items-center gap-2 flex-1 min-h-0 cursor-pointer px-1 rounded-sm border transition-colors duration-150 ${isActive ? "bg-white/5 border-white/10" : "border-transparent"}`}
          >
            <div
              className={`w-5 h-5 rounded-sm shrink-0 border ${isActive ? "border-white/30" : "border-white/10"}`}
              style={{
                background: color.hex,
                boxShadow: isActive ? `0 0 8px ${color.hex}44` : "none",
              }}
            />

            <div className="text-xs text-neutral-700 bg-white/5 border border-white/5 rounded-sm px-1.5 py-0.5 shrink-0 tracking-wider">
              {String(color.beats).padStart(2, "0")}b
            </div>

            <div className="flex-1 flex items-center gap-1.5 min-w-0">
              <span className="text-xs text-neutral-700 tracking-wider shrink-0">
                TOL
              </span>
              <input
                type="range"
                min={5}
                max={60}
                step={1}
                value={color.tolerance}
                onChange={(e) => {
                  e.stopPropagation();
                  handleColorChange(color.id, {
                    tolerance: Number(e.target.value),
                  });
                }}
                onClick={(e) => e.stopPropagation()}
                className="horizontal-slider flex-1"
                style={{
                  background: `linear-gradient(to right, #545454 ${tolerancePercent}%, #1c1c1c ${tolerancePercent}%)`,
                }}
              />
              <span className="text-xs text-neutral-600 tabular-nums w-5 text-right shrink-0">
                {color.tolerance}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ColorPanel;
