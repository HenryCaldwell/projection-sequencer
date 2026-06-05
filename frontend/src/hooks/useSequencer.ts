import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { NUM_BEATS } from "../lib/constants";

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
};

type Return = {
  playing: boolean;
  stopPending: boolean;
  currentBeat: number;
  play: () => void;
  stop: () => void;
};

export function useSequencer({ bpm }: Args): Return {
  // References
  const lastBeatRef = useRef(0);
  const stopPendingRef = useRef(false);

  const audioRef = useRef<AudioGraph | null>(null);

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
      snare: new Tone.NoiseSynth().connect(gains.snare),
      hihat: new Tone.NoiseSynth().connect(gains.hihat),
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

  // Scheduler
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
  };
}
