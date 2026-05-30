import type { Color, Marker } from "./types";

export const NUM_BEATS = 16;
export const NUM_LANES = 4;

export const LANE_NAMES = ["KICK", "SNARE", "HIHAT", "BASS"];

export const DEFAULT_COLORS: Color[] = [
  { id: "1", beats: 1, hex: "#cc3d85", tolerance: 25 },
  { id: "2", beats: 2, hex: "#d9742b", tolerance: 25 },
  { id: "3", beats: 3, hex: "#e6d739", tolerance: 25 },
  { id: "4", beats: 4, hex: "#43bf43", tolerance: 25 },
  { id: "5", beats: 8, hex: "#3d85cc", tolerance: 25 },
  { id: "6", beats: 16, hex: "#1d1d73", tolerance: 25 },
];

export const DEMO_MARKERS: Marker[] = [
  // KICK
  { beat: 1, lane: 0, colorId: "4" },
  { beat: 5, lane: 0, colorId: "4" },
  { beat: 9, lane: 0, colorId: "4" },
  { beat: 13, lane: 0, colorId: "4" },

  // SNARE
  { beat: 5, lane: 1, colorId: "2" },
  { beat: 13, lane: 1, colorId: "2" },

  // HIHAT
  { beat: 1, lane: 2, colorId: "1" },
  { beat: 3, lane: 2, colorId: "1" },
  { beat: 5, lane: 2, colorId: "1" },
  { beat: 7, lane: 2, colorId: "1" },
  { beat: 9, lane: 2, colorId: "3" },
  { beat: 11, lane: 2, colorId: "1" },
  { beat: 13, lane: 2, colorId: "1" },
  { beat: 15, lane: 2, colorId: "1" },

  // BASS
  { beat: 1, lane: 3, colorId: "6" },
  { beat: 9, lane: 3, colorId: "5" },
];
