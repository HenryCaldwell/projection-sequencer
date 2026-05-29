import { LANE_NAMES } from "../../lib/constants";
import Fader from "./Fader";

type Props = {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  masterVolume: number;
  onMasterVolumeChange: (volume: number) => void;
  laneVolumes: number[];
  onLaneVolumesChange: (volumes: number[]) => void;
};

function FaderBank({
  bpm,
  onBpmChange,
  masterVolume,
  onMasterVolumeChange,
  laneVolumes,
  onLaneVolumesChange,
}: Props) {
  const handleLaneVolumeChange = (index: number, value: number) => {
    onLaneVolumesChange(laneVolumes.with(index, value * 0.01));
  };

  return (
    <div className="flex-1 flex flex-col px-2.5 pt-3.5 pb-3.5 min-h-0">
      <div className="text-xs text-neutral-700 tracking-widest mb-2.5 pl-1">
        LEVELS
      </div>
      <div className="flex-1 flex justify-evenly min-h-0">
        <Fader
          value={bpm}
          min={10}
          max={300}
          step={5}
          onValueChange={onBpmChange}
          label="BPM"
        />
        <Fader
          value={Math.round(masterVolume * 100)}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => onMasterVolumeChange(value * 0.01)}
          label="MASTER"
        />
        {LANE_NAMES.map((name, i) => (
          <Fader
            key={name}
            value={Math.round(laneVolumes[i] * 100)}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => handleLaneVolumeChange(i, value)}
            label={name}
          />
        ))}
      </div>
    </div>
  );
}

export default FaderBank;
