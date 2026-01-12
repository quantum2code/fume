import { db } from "../../db/db.js";
import {
  app,
  appPrice,
  appImages,
  appMovies,
  appAchievement,
  appRequirement,
  appCategoryLink,
  appContentLink,
  company,
  category,
  appCompanyLink,
} from "../../db/schema/app.schema.js";
import type { SteamAppDetails } from "../../types/zod/steam.js";
import { eq, sql } from "drizzle-orm";

export const InserSteamAppDetails = async (
  data: SteamAppDetails
): Promise<number> => {
  const appData: typeof app.$inferInsert = {
    steamAppId: data.steam_appid,
    type: data.type,
    name: data.name,
    website: data.website || null,
    heroImage: data.header_image,
    // Map optional / nullable fields
    requiredAge:
      typeof data.required_age === "string"
        ? parseInt(data.required_age, 10) || null
        : (data.required_age as number | undefined) || null,
    controllerSupport: data.controller_support || null,
    legalNotice: data.legal_notice || null,
    descriptionShort: data.short_description,
    descriptionDetailed:
      data.detailed_description || data.about_the_game || null,
    // Keep languages as provided (Steam returns an HTML string); store as JSONB-compatible value
    languagesSupported: data.supported_languages || null,
    metacriticData: data.metacritic || null,
    releaseDateInfo: data.release_date || null,
  };
  const result = await db.insert(app).values(appData).returning({ id: app.id });
  return result[0].id;
};

// --- Additional insert helpers for related tables ---

export const insertAppPrice = async (
  appId: number,
  priceOverview: SteamAppDetails["price_overview"] | undefined
) => {
  if (!priceOverview) return;

  const priceData: typeof appPrice.$inferInsert = {
    appId,
    currencyCode: priceOverview.currency,
    priceInitial: Math.floor(priceOverview.initial ?? 0),
    priceFinal: Math.floor(priceOverview.final ?? 0),
    discountPercent: Math.floor(priceOverview.discount_percent ?? 0),
  };

  await db.insert(appPrice).values(priceData);
};

export const insertAppImages = async (
  appId: number,
  screenshots: SteamAppDetails["screenshots"] | undefined
) => {
  if (!screenshots?.length) return;

  const rows = screenshots.map((s) => ({
    appId,
    pathThumbnail: s.path_thumbnail,
    pathFull: s.path_full,
  }));

  await db.insert(appImages).values(rows);
};

export const insertAppMovies = async (
  appId: number,
  movies: SteamAppDetails["movies"] | undefined
) => {
  if (!movies?.length) return;

  const rows = movies.map((m) => ({
    appId,
    name: m.name,
    thumbnail: m.thumbnail,
    url480p: m.webm?.["480"] ?? null,
    urlMax: m.webm?.max ?? null,
  }));

  await db.insert(appMovies).values(rows);
};

export const insertAppAchievements = async (
  appId: number,
  achievements: SteamAppDetails["achievements"] | undefined
) => {
  if (!achievements?.highlighted?.length) return;

  const rows = achievements.highlighted.map((h) => ({
    appId,
    name: h.name,
    description: null,
    iconUrl: h.path,
    globalPercent: null,
  }));

  await db.insert(appAchievement).values(rows);
};

export const insertAppRequirements = async (
  appId: number,
  pc: SteamAppDetails["pc_requirements"] | undefined,
  mac: SteamAppDetails["mac_requirements"] | undefined,
  linux: SteamAppDetails["linux_requirements"] | undefined
) => {
  const toRows: Array<typeof appRequirement.$inferInsert> = [];

  const pushFrom = (platform: string, req: any) => {
    if (!req) return;
    // Steam sometimes returns an object with minimum/recommended or an empty array
    if (Array.isArray(req)) return;
    if (req.minimum) {
      toRows.push({
        appId,
        platform,
        specType: "min",
        description: req.minimum,
      });
    }
    if (req.recommended) {
      toRows.push({
        appId,
        platform,
        specType: "recommended",
        description: req.recommended,
      });
    }
  };

  pushFrom("windows", pc);
  pushFrom("mac", mac);
  pushFrom("linux", linux);

  if (!toRows.length) return;
  await db.insert(appRequirement).values(toRows);
};

export const insertAppCategoryLinks = async (
  appId: number,
  categories:
    | SteamAppDetails["categories"]
    | SteamAppDetails["genres"]
    | undefined,
  categoryType: "category" | "genre" | null = null
) => {
  if (!categories?.length) return;

  // Steam category/genre IDs are often numeric (string or number). We attempt to coerce.
  const rows = categories.map((c) => ({
    name: c.description,
    id: Number(c.id),
    type: categoryType,
  }));
  const rowsLink = categories.map((c: any) => ({
    appId,
    categoryId: Number(c.id) || 0,
  }));

  // If categoryId resolves to 0 that's a signal that calling code should verify
  await db.insert(category).values(rows).onConflictDoNothing();
  await db.insert(appCategoryLink).values(rowsLink).onConflictDoNothing();
};

export const insertAppContentLinks = async (
  appId: number,
  dlc: SteamAppDetails["dlc"] | undefined
) => {
  if (!dlc?.length) return;

  const rows = dlc.map((childId) => ({
    parentAppId: appId,
    childAppId: Number(childId),
    type: "dlc",
  }));

  await db.insert(appContentLink).values(rows);
};

export const insertAppCompanyLinks = async (
  appId: number,
  developers: SteamAppDetails["developers"] | undefined,
  publishers: SteamAppDetails["publishers"] | undefined
) => {
  const linkRows: Array<typeof appCompanyLink.$inferInsert> = [];

  const processCompanies = async (
    names: string[] | undefined,
    role: "developer" | "publisher"
  ) => {
    if (!names?.length) return;
    for (const name of names) {
      // Try to find existing company or insert new one
      const existing = await db
        .select()
        .from(company)
        .where(eq(company.name, name))
        .limit(1);

      let companyId: number;
      if (existing.length > 0) {
        companyId = existing[0].id;
      } else {
        // Get max ID and increment
        const maxResult = await db
          .select({ maxId: sql<number>`MAX(${company.id})` })
          .from(company);
        const maxId = maxResult[0]?.maxId || 0;
        companyId = maxId + 1;
        await db.insert(company).values({ id: companyId, name });
      }
      linkRows.push({ appId, companyId, role });
    }
  };

  await processCompanies(developers, "developer");
  await processCompanies(publishers, "publisher");

  if (linkRows.length > 0) {
    await db.insert(appCompanyLink).values(linkRows).onConflictDoNothing();
  }
};
