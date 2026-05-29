import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  label: string;
};

function Fader({ value, min, max, step, onValueChange, label }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [sliderHeight, setSliderHeight] = useState(100);

  useEffect(() => {
    const element = sliderRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() =>
      setSliderHeight(element.clientHeight),
    );
    observer.observe(element);
    setSliderHeight(element.clientHeight);

    return () => observer.disconnect();
  }, []);

  const percent = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <span className="text-xs text-neutral-400 mb-1.5 tabular-nums">
        {value}
      </span>

      <div
        ref={sliderRef}
        className="flex-1 w-full flex items-center justify-center min-h-15"
      >
        <input
          type="range"
          onChange={(e) => onValueChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          value={value}
          className="vertical-slider"
          style={{
            height: Math.max(sliderHeight, 60),
            background: `linear-gradient(to top, #686868 ${percent}%, #1e1e1e ${percent}%)`,
          }}
        />
      </div>

      <div className="mt-2 h-20 flex items-center justify-center shrink-0">
        <span
          className="w-6 h-18 text-xs text-neutral-700 tracking-widest uppercase whitespace-nowrap bg-white/5 border border-white/5 rounded flex items-center justify-center overflow-hidden"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default Fader;
