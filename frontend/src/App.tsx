import { useState } from "react";
import CrtEffect from "./components/sequencer/CrtEffect";
import Grid from "./components/sequencer/Grid";
import FaderBank from "./components/sidebar/FaderBank";
import Transport from "./components/sidebar/Transport";
import Toolbar from "./components/toolbar/Toolbar";
import { usePlayhead } from "./hooks/usePlayhead";
import { useSequencer } from "./hooks/useSequencer";
import { DEFAULT_COLORS, DEMO_MARKERS } from "./lib/constants";
import type { Color, Marker } from "./lib/types";

function App() {
  // States
  const [bpm, setBpm] = useState(120);

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [laneVolumes, setLaneVolumes] = useState<number[]>([
    0.8, 0.8, 0.8, 0.8,
  ]);

  const [colors, setColors] = useState<Color[]>(DEFAULT_COLORS);
  const [markers] = useState<Marker[]>(DEMO_MARKERS);

  // Sequencer
  const { playing, stopPending, currentBeat, play, stop, progress } =
    useSequencer({
      bpm,
    });
  const playheadRef = usePlayhead({ playing, progress });

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
          onPlay={play}
          onStop={stop}
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
