export type ScreenshotSchema = {
  id: number;
  path_thumbnail: string;
  path_full: string;
};

export type MovieSchema = {
  name: string;
  thumbnail: string;
  urlMax: string;
  url480p: string;
};

export type AchievementSchema = {
  name: string;
  description: string | null;
  iconUrl: string | null;
  globalPercent: string | null;
};

export type PriceSchema = {
  initial: number;
  final: number;
  currency: string;
};

export type AppSchema = {
  steamId: number;
  type: string;
  title: string;
  website?: string;
  assets: {
    hero: string;
    screenshots: ScreenshotSchema[] | null;
    videos: MovieSchema[] | null;
  };
  credits: {
    developers: { id: number; name: string }[];
    publishers: { id: number; name: string }[];
  };
  description: {
    short: string;
  };
  price?: PriceSchema;
  genre: string[];
  category: string[];
};
