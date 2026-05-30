import { useEffect, useRef, useState } from "react";
import CrtEffect from "./components/sequencer/CrtEffect";
import Grid from "./components/sequencer/Grid";
import FaderBank from "./components/sidebar/FaderBank";
import Transport from "./components/sidebar/Transport";
import Toolbar from "./components/toolbar/Toolbar";
import { DEFAULT_COLORS, NUM_BEATS } from "./lib/constants";
import type { Color } from "./lib/types";

function App() {
  // References
  const playheadRef = useRef<HTMLDivElement>(null);
  const lastBeatRef = useRef(1);
  const stopPendingRef = useRef(false);

  // States
  const [playing, setPlaying] = useState(false);
  const [stopPending, setStopPending] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentBeat, setCurrentBeat] = useState(1);

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [laneVolumes, setLaneVolumes] = useState<number[]>([
    0.8, 0.8, 0.8, 0.8,
  ]);

  const [colors, setColors] = useState<Color[]>(DEFAULT_COLORS);

  // Handlers
  const handlePlay = () => {
    setPlaying(true);
    setStopPending(false);
    stopPendingRef.current = false;
  };

  const handleStop = () => {
    if (stopPending) {
      setPlaying(false);
      setStopPending(false);
      stopPendingRef.current = false;
    } else {
      setStopPending(true);
      stopPendingRef.current = true;
    }
  };

  // Effects
  useEffect(() => {
    if (!playing) {
      return;
    }

    let start: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      if (start === null) {
        start = now;
      }

      const elapsed = (now - start) / 1000;
      const loop = (60 / bpm) * NUM_BEATS;
      const position = (elapsed % loop) / loop;
      const beat = Math.floor(position * NUM_BEATS) + 1;

      if (beat !== lastBeatRef.current) {
        const wrapped = lastBeatRef.current > 1 && beat === 1;
        lastBeatRef.current = beat;
        setCurrentBeat(beat);

        if (stopPendingRef.current && wrapped) {
          setPlaying(false);
          setStopPending(false);
          stopPendingRef.current = false;
        }
      }

      if (playheadRef.current) {
        playheadRef.current.style.left = `${position * 100}%`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      lastBeatRef.current = 1;
      setCurrentBeat(1);
      cancelAnimationFrame(rafId);

      if (playheadRef.current) {
        playheadRef.current.style.left = "0%";
      }
    };
  }, [playing, bpm]);

  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden bg-neutral-950">
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <CrtEffect />
          <Grid playheadRef={playheadRef} />
        </div>

        <Toolbar colors={colors} onColorsChange={setColors} />
      </div>

      <div className="w-52 shrink-0 flex flex-col overflow-hidden border-l border-white/5">
        <Transport
          playing={playing}
          stopPending={stopPending}
          onPlay={handlePlay}
          onStop={handleStop}
          bpm={bpm}
          currentBeat={currentBeat}
        />
        <FaderBank
          bpm={bpm}
          onBpmChange={setBpm}
          masterVolume={masterVolume}
          onMasterVolumeChange={setMasterVolume}
          laneVolumes={laneVolumes}
          onLaneVolumesChange={setLaneVolumes}
        />
      </div>
    </div>
  );
}

export default App;
