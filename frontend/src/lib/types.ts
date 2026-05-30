export type Color = {
  id: string;
  beats: number;
  hex: string;
  tolerance: number;
};

export type Marker = {
  beat: number;
  lane: number;
  colorId: string;
};
