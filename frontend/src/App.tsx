import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import CrtEffect from "./components/sequencer/CrtEffect";
import Grid from "./components/sequencer/Grid";
import FaderBank from "./components/sidebar/FaderBank";
import Transport from "./components/sidebar/Transport";
import Toolbar from "./components/toolbar/Toolbar";
import { DEFAULT_COLORS, DEMO_MARKERS, NUM_BEATS } from "./lib/constants";
import type { Color, Marker } from "./lib/types";

function App() {
  // References
  const playheadRef = useRef<HTMLDivElement>(null);

  const lastBeatRef = useRef(0);
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
  const [markers] = useState<Marker[]>(DEMO_MARKERS);

  // Handlers
  const handlePlay = () => {
    Tone.start();
    Tone.getTransport().start();
    setPlaying(true);
    setStopPending(false);
    stopPendingRef.current = false;
  };

  const handleStop = () => {
    if (stopPending) {
      Tone.getTransport().stop();
      setPlaying(false);
      setStopPending(false);
      stopPendingRef.current = false;
    } else {
      setStopPending(true);
      stopPendingRef.current = true;
    }
  };

  // Effects
  // Transport config
  useEffect(() => {
    const transport = Tone.getTransport();
    transport.loop = true;
    transport.loopStart = 0;
    transport.loopEnd = "4m";

    Tone.getContext().lookAhead = 0.01;
  }, []);

  // BPM sync
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  // Engine
  useEffect(() => {
    const transport = Tone.getTransport();

    const id = transport.scheduleRepeat(() => {
      const next = (lastBeatRef.current % NUM_BEATS) + 1;
      const wrapped = lastBeatRef.current > 1 && next === 1;
      lastBeatRef.current = next;
      setCurrentBeat(next);

      if (stopPendingRef.current && wrapped) {
        transport.stop();
        setPlaying(false);
        setStopPending(false);
        stopPendingRef.current = false;
      }
    }, "4n");

    return () => {
      transport.clear(id);
    };
  }, []);

  // Playhead
  useEffect(() => {
    if (!playing) {
      return;
    }

    let rafId: number;

    const tick = () => {
      if (playheadRef.current) {
        const progress = Tone.getTransport().progress;
        playheadRef.current.style.left = `${progress * 100}%`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lastBeatRef.current = 0;
      setCurrentBeat(1);

      if (playheadRef.current) {
        playheadRef.current.style.left = "0%";
      }
    };
  }, [playing]);

  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden bg-neutral-950">
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <CrtEffect />
          <Grid
            playheadRef={playheadRef}
            markers={markers}
            colors={colors}
            activeBeat={playing ? currentBeat : null}
          />
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
