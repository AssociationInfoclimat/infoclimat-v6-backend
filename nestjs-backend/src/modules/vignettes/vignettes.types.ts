export type VignetteStation = {
  type: 'station';
  contentAsHtml: string; // TODO: Build this as a json from the station. For now its the HTML of the station weather information.
};

export type VignettePhoto = {
  type: 'photo';
  timeKey: number;
  backgroundPosition: [number, number]; // [x, y]
};

export type VignetteVigilance = {
  type: 'vigilance';
  contentAsHtml: string; // TODO: Build this as a json from the vigilance. For now its the HTML of the vigilance.
};

export type VignetteCrue = {
  type: 'crue';
  contentAsHtml: string; // TODO: Build this as a json from the crue. For now its the HTML of the crue.
};

export type VignettesReponse = {
  vignettes: (
    | VignetteStation
    | VignettePhoto
    | VignetteVigilance
    | VignetteCrue
  )[];
  photosSpriteUrl: string;
};
