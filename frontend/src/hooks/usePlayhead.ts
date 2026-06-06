import { type RefObject, useEffect, useRef } from "react";

type Args = {
  playing: boolean;
  progress: () => number;
};

export function usePlayhead({
  playing,
  progress,
}: Args): RefObject<HTMLDivElement | null> {
  const playheadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!playing) {
      if (playheadRef.current) {
        playheadRef.current.style.left = "0%";
      }

      return;
    }

    let rafId: number;

    const tick = () => {
      if (playheadRef.current) {
        playheadRef.current.style.left = `${progress() * 100}%`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [playing, progress]);

  return playheadRef;
}
