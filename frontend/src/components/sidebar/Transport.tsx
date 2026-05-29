import { Play, Square } from "lucide-react";
import { NUM_BEATS } from "../../lib/constants";

type Props = {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  bpm: number;
  currentBeat: number;
};

function Transport({ playing, onPlayingChange, bpm, currentBeat }: Props) {
  return (
    <div className="px-4 pt-4 pb-3 border-b border-white/5 shrink-0">
      {/* Play */}
      <button
        onClick={() => onPlayingChange(!playing)}
        className={`w-full h-9 flex items-center justify-center rounded-md py-2 mb-4 border cursor-pointer transition-colors duration-150 ${
          playing
            ? "bg-green-400/10 border-green-400/20 text-green-400"
            : "bg-white/5 border-white/5 text-neutral-500 hover:bg-white/10"
        }`}
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
          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
            playing ? "bg-green-400" : "bg-neutral-800"
          }`}
          style={playing ? { boxShadow: "0 0 5px #4ade80" } : undefined}
        />
        <span
          className={`text-xs tracking-widest ${playing ? "text-green-400" : "text-neutral-700"}`}
        >
          {playing ? "REC" : "STOP"}
        </span>
      </div>
    </div>
  );
}

export default Transport;
