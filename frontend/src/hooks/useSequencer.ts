import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { NUM_BEATS } from "../lib/constants";
import type { Color, Marker } from "../lib/types";

type AudioGraph = {
  synths: {
    kick: Tone.MembraneSynth;
    snare: Tone.NoiseSynth;
    hihat: Tone.NoiseSynth;
    bass: Tone.FMSynth;
  };
  gains: {
    kick: Tone.Gain;
    snare: Tone.Gain;
    hihat: Tone.Gain;
    bass: Tone.Gain;
  };
  master: Tone.Gain;
};

type Args = {
  bpm: number;
  masterVolume: number;
  laneVolumes: number[];
  markers: Marker[];
  colors: Color[];
};

type Return = {
  playing: boolean;
  stopPending: boolean;
  currentBeat: number;
  play: () => void;
  stop: () => void;
  progress: () => number;
};

export function useSequencer({
  bpm,
  masterVolume,
  laneVolumes,
  markers,
  colors,
}: Args): Return {
  // References
  const lastBeatRef = useRef(0);
  const stopPendingRef = useRef(false);

  const audioRef = useRef<AudioGraph | null>(null);

  const markersRef = useRef<Marker[]>(markers);
  const colorsRef = useRef<Color[]>(colors);

  // States
  const [playing, setPlaying] = useState(false);
  const [stopPending, setStopPending] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);

  // Handlers
  const play = () => {
    Tone.start();
    Tone.getTransport().start();
    setPlaying(true);
    setStopPending(false);
    stopPendingRef.current = false;
  };

  const stop = () => {
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

  const progress = useCallback(() => Tone.getTransport().progress, []);

  // Effects
  // Audio graph
  useEffect(() => {
    const master = new Tone.Gain(0.8).toDestination();

    const gains = {
      kick: new Tone.Gain(0.8).connect(master),
      snare: new Tone.Gain(0.8).connect(master),
      hihat: new Tone.Gain(0.8).connect(master),
      bass: new Tone.Gain(0.8).connect(master),
    };

    const synths = {
      kick: new Tone.MembraneSynth().connect(gains.kick),
      snare: new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.05 },
      }).connect(gains.snare),
      hihat: new Tone.NoiseSynth({
        envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 },
      }).connect(gains.hihat),
      bass: new Tone.FMSynth().connect(gains.bass),
    };

    audioRef.current = { synths, gains, master };

    return () => {
      Object.values(synths).forEach((synth) => synth.dispose());
      Object.values(gains).forEach((gain) => gain.dispose());
      master.dispose();
      audioRef.current = null;
    };
  }, []);

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

  // Markers sync
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  // Colors sync
  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  // Master volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.master.gain.value = masterVolume;
    }
  }, [masterVolume]);

  // Lane volumes sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.gains.kick.gain.value = laneVolumes[0];
      audioRef.current.gains.snare.gain.value = laneVolumes[1];
      audioRef.current.gains.hihat.gain.value = laneVolumes[2];
      audioRef.current.gains.bass.gain.value = laneVolumes[3];
    }
  }, [laneVolumes]);

  // Scheduler
  useEffect(() => {
    const transport = Tone.getTransport();

    const id = transport.scheduleRepeat((time) => {
      const next = (lastBeatRef.current % NUM_BEATS) + 1;
      const wrapped = lastBeatRef.current > 1 && next === 1;
      lastBeatRef.current = next;
      setCurrentBeat(next);

      if (stopPendingRef.current && wrapped) {
        transport.stop();
        setPlaying(false);
        setStopPending(false);
        stopPendingRef.current = false;
      } else {
        const synths = audioRef.current?.synths;

        if (synths) {
          for (const marker of markersRef.current) {
            if (marker.beat !== next) {
              continue;
            }

            const color = colorsRef.current.find(
              (c) => c.id === marker.colorId,
            );
            if (!color) {
              continue;
            }

            const duration = `0:${color.beats}:0`;

            switch (marker.lane) {
              case 0:
                synths.kick.triggerAttackRelease("C2", duration, time);
                break;
              case 1:
                synths.snare.triggerAttackRelease(duration, time);
                break;
              case 2:
                synths.hihat.triggerAttackRelease(duration, time);
                break;
              case 3:
                synths.bass.triggerAttackRelease("C2", duration, time);
                break;
            }
          }
        }
      }
    }, "4n");

    return () => {
      transport.clear(id);
    };
  }, []);

  // Reset
  useEffect(() => {
    if (!playing) {
      lastBeatRef.current = 0;
      setCurrentBeat(1);
    }
  }, [playing]);

  return {
    playing,
    stopPending,
    currentBeat,
    play,
    stop,
    progress,
  };
}
