import { useState } from "react";
import CrtEffect from "./components/sequencer/CrtEffect";
import Grid from "./components/sequencer/Grid";
import FaderBank from "./components/sidebar/FaderBank";
import Transport from "./components/sidebar/Transport";

function App() {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [laneVolumes, setLaneVolumes] = useState<number[]>([
    0.8, 0.8, 0.8, 0.8,
  ]);

  const currentBeat = 1;

  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden bg-neutral-950">
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <CrtEffect />
          <Grid />
        </div>

        <div className="h-56 shrink-0 flex flex-row overflow-x-auto overflow-y-hidden border-t border-white/5" />
      </div>

      <div className="w-52 shrink-0 flex flex-col overflow-hidden border-l border-white/5">
        <Transport
          playing={playing}
          onPlayingChange={setPlaying}
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
