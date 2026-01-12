import type { AppSchema } from "../types/types.js";
import type { SteamAppDetails } from "../types/zod/steam.js";
import type {
  app,
  appImages,
  appMovies,
  appPrice,
  appCategoryLink,
  category,
  appCompanyLink,
  company,
} from "../db/schema/app.schema.js";

export const mapSteamAppDetails = (data: SteamAppDetails): AppSchema => {
  return {
    steamId: data.steam_appid,
    type: data.type,
    title: data.name,
    website: data.website || undefined,
    assets: {
      hero: data.header_image,
      screenshots: data.screenshots
        ? data.screenshots.map((s) => ({
            id: s.id,
            path_thumbnail: s.path_thumbnail,
            path_full: s.path_full,
          }))
        : null,
      videos: data.movies
        ? data.movies.map((m) => ({
            name: m.name,
            thumbnail: m.thumbnail,
            urlMax: m.webm?.max || "",
            url480p: m.webm?.["480"] || "",
          }))
        : null,
    },
    credits: {
      developers: data.developers
        ? data.developers.map((dev, index) => ({ id: index, name: dev }))
        : [],
      publishers: data.publishers.map((pub, index) => ({
        id: index,
        name: pub,
      })),
    },
    price: data.price_overview
      ? {
          currency: data.price_overview.currency,
          initial: data.price_overview.initial,
          final: data.price_overview.final,
        }
      : undefined,
    description: {
      short: data.short_description,
    },
    genre: data.genres ? data.genres.map((g) => g.description) : [],
    category: data.categories ? data.categories.map((c) => c.description) : [],
  };
};

type AppWithRelations = typeof app.$inferSelect & {
  images?: (typeof appImages.$inferSelect)[];
  movies?: (typeof appMovies.$inferSelect)[];
  price?: typeof appPrice.$inferSelect | null;
  categories?: (typeof appCategoryLink.$inferSelect & {
    category: typeof category.$inferSelect;
  })[];
  companies?: (typeof appCompanyLink.$inferSelect & {
    company: typeof company.$inferSelect;
  })[];
};

export const mapDbAppToAppSchema = (dbApp: AppWithRelations): AppSchema => {
  const developers =
    dbApp.companies
      ?.filter((c) => c.role === "developer")
      .map((c, index) => ({ id: c.company.id, name: c.company.name })) || [];
  const publishers =
    dbApp.companies
      ?.filter((c) => c.role === "publisher")
      .map((c, index) => ({ id: c.company.id, name: c.company.name })) || [];

  const genres =
    dbApp.categories
      ?.filter((c) => c.category.type === "genre")
      .map((c) => c.category.name) || [];
  const categories =
    dbApp.categories
      ?.filter((c) => c.category.type === "category")
      .map((c) => c.category.name) || [];

  return {
    steamId: dbApp.steamAppId,
    type: dbApp.type,
    title: dbApp.name,
    website: dbApp.website || undefined,
    assets: {
      hero: dbApp.heroImage,
      screenshots: dbApp.images
        ? dbApp.images.map((img, index) => ({
            id: img.id,
            path_thumbnail: img.pathThumbnail || "",
            path_full: img.pathFull || "",
          }))
        : null,
      videos: dbApp.movies
        ? dbApp.movies.map((m) => ({
            name: m.name || "",
            thumbnail: m.thumbnail || "",
            urlMax: m.urlMax || "",
            url480p: m.url480p || "",
          }))
        : null,
    },
    credits: {
      developers,
      publishers,
    },
    price: dbApp.price
      ? {
          currency: dbApp.price.currencyCode,
          initial: dbApp.price.priceInitial,
          final: dbApp.price.priceFinal,
        }
      : undefined,
    description: {
      short: dbApp.descriptionShort,
    },
    genre: genres,
    category: categories,
  };
};
