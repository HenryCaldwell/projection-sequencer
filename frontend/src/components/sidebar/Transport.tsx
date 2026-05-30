import { Play, Square } from "lucide-react";
import { NUM_BEATS } from "../../lib/constants";

type Props = {
  playing: boolean;
  stopPending: boolean;
  onPlay: () => void;
  onStop: () => void;
  bpm: number;
  currentBeat: number;
};

function Transport({
  playing,
  stopPending,
  onPlay,
  onStop,
  bpm,
  currentBeat,
}: Props) {
  const buttonClass = stopPending
    ? "bg-amber-400/10 border-amber-400/20 text-amber-400"
    : playing
      ? "bg-green-400/10 border-green-400/20 text-green-400"
      : "bg-white/5 border-white/5 text-neutral-500 hover:bg-white/10";

  const dotClass = stopPending
    ? "bg-amber-400"
    : playing
      ? "bg-green-400"
      : "bg-neutral-800";
  const textClass = stopPending
    ? "text-amber-400"
    : playing
      ? "text-green-400"
      : "text-neutral-700";
  const recText = stopPending ? "STOPPING" : playing ? "REC" : "STOP";
  const dotGlow = stopPending
    ? "0 0 5px #fbbf24"
    : playing
      ? "0 0 5px #4ade80"
      : undefined;

  return (
    <div className="px-4 pt-4 pb-3 border-b border-white/5 shrink-0">
      {/* Play */}
      <button
        onClick={playing ? onStop : onPlay}
        className={`w-full h-9 flex items-center justify-center rounded-md py-2 mb-4 border cursor-pointer transition-colors duration-150 ${buttonClass}`}
      >
        {playing ? <Square size={14} /> : <Play size={16} />}
      </button>

      {/* Beat + BPM */}
      <div className="flex">
        <div className="flex-1">
          <div className="text-xs text-neutral-700 tracking-widest mb-1">
            BEAT
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-neutral-400 leading-none tabular-nums">
              {String(currentBeat).padStart(2, "0")}
            </span>
            <span className="text-xs text-neutral-700">/{NUM_BEATS}</span>
          </div>
        </div>
        <div className="w-px bg-white/5 mx-3.5" />
        <div className="flex-1">
          <div className="text-xs text-neutral-700 tracking-widest mb-1">
            BPM
          </div>
          <div className="text-3xl font-bold text-neutral-400 leading-none tabular-nums">
            {bpm}
          </div>
        </div>
      </div>

      {/* Indicator */}
      <div className="flex items-center gap-1.5 mt-3">
        <div
          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-150 ${dotClass}`}
          style={dotGlow ? { boxShadow: dotGlow } : undefined}
        />
        <span className={`text-xs tracking-widest ${textClass}`}>
          {recText}
        </span>
      </div>
    </div>
  );
}

export default Transport;
