import type { RefObject } from "react";
import { NUM_BEATS, NUM_LANES } from "../../lib/constants";

type Props = {
  playheadRef: RefObject<HTMLDivElement | null>;
};

function Grid({ playheadRef }: Props) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: `min(92%, ${(NUM_BEATS / NUM_LANES) * 62}vh)`,
        aspectRatio: `${NUM_BEATS}/${NUM_LANES}`,
      }}
    >
      {/* Grid lines */}
      <svg
        viewBox={`0 0 ${NUM_BEATS} ${NUM_LANES}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        overflow="visible"
      >
        {Array.from({ length: NUM_BEATS + 1 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i}
            y1={0}
            x2={i}
            y2={NUM_LANES}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={0.03}
          />
        ))}
        {Array.from({ length: NUM_LANES + 1 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i}
            x2={NUM_BEATS}
            y2={i}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={0.03}
          />
        ))}
      </svg>

      {/* Cells */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${NUM_BEATS}, 1fr)`,
          gridTemplateRows: `repeat(${NUM_LANES}, 1fr)`,
        }}
      >
        {Array.from({ length: NUM_LANES * NUM_BEATS }, (_, i) => (
          <div
            key={i}
            className="m-0.5 rounded-sm bg-white/1 border border-white/2"
          />
        ))}
      </div>

      {/* Playhead */}
      <div
        ref={playheadRef}
        className="grid-playhead absolute w-0.5 bg-white/80 pointer-events-none"
        style={{
          top: "-6%",
          bottom: "-6%",
          left: "0%",
          transform: "translateX(-50%)",
          boxShadow:
            "0 0 8px rgba(255, 255, 255, 0.5), 0 0 22px rgba(180, 180, 255, 0.2)",
        }}
      />
    </div>
  );
}

export default Grid;
