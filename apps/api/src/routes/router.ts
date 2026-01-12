import { Hono } from "hono";
import { db } from "../db/db.js";
import {
  app,
  appImages,
  appMovies,
  appPrice,
  appCategoryLink,
  category,
  appCompanyLink,
  company,
} from "../db/schema/app.schema.js";
import { eq } from "drizzle-orm";
import { mapSteamAppDetails, mapDbAppToAppSchema } from "../utils/mapper.js";
import {
  InserSteamAppDetails,
  insertAppPrice,
  insertAppImages,
  insertAppMovies,
  insertAppCategoryLinks,
  insertAppCompanyLinks,
} from "../utils/helpers/steam.js";
import {
  SteamApiResponseSchema,
  type SteamAppDetails,
} from "../types/zod/steam.js";

const apiRouter = new Hono();

const fetchSteamAppDetails = async (
  appId: string
): Promise<SteamAppDetails | null> => {
  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`
    );

    const data = await response.json();
    const parsed = SteamApiResponseSchema.parse(data);
    const appData = parsed[appId];
    if (!appData || !appData.success || !appData.data) {
      return null;
    }
    return appData.data;
  } catch (error) {
    console.error("Error fetching Steam app details:", error);
    return null;
  }
};

apiRouter.get("/", (c) => c.text("api route"));
apiRouter.get("/apps/:appId", async (c) => {
  const { appId } = c.req.param();
  const steamAppId = parseInt(appId, 10);

  if (isNaN(steamAppId)) {
    return c.json({ error: "Invalid app ID" }, 400);
  }

  // Check if app record already exists
  const existingApp = await db
    .select()
    .from(app)
    .where(eq(app.steamAppId, steamAppId))
    .limit(1);

  if (existingApp.length > 0) {
    const appRecord = existingApp[0];
    if (!appRecord) {
      return c.json({ error: "App not found" }, 404);
    }

    // Fetch related data
    const [images, movies, price, categories, companies] = await Promise.all([
      db.select().from(appImages).where(eq(appImages.appId, appRecord.id)),
      db.select().from(appMovies).where(eq(appMovies.appId, appRecord.id)),
      db
        .select()
        .from(appPrice)
        .where(eq(appPrice.appId, appRecord.id))
        .limit(1),
      db
        .select({
          appId: appCategoryLink.appId,
          categoryId: appCategoryLink.categoryId,
          category: category,
        })
        .from(appCategoryLink)
        .innerJoin(category, eq(appCategoryLink.categoryId, category.id))
        .where(eq(appCategoryLink.appId, appRecord.id)),
      db
        .select({
          appId: appCompanyLink.appId,
          companyId: appCompanyLink.companyId,
          role: appCompanyLink.role,
          company: company,
        })
        .from(appCompanyLink)
        .innerJoin(company, eq(appCompanyLink.companyId, company.id))
        .where(eq(appCompanyLink.appId, appRecord.id)),
    ]);

    const appWithRelations = {
      ...appRecord,
      images,
      movies,
      price: price[0] || null,
      categories,
      companies,
    } as Parameters<typeof mapDbAppToAppSchema>[0];

    const appSchema = mapDbAppToAppSchema(appWithRelations);
    return c.json({ data: appSchema });
  }

  // Fetch from Steam API
  const steamData = await fetchSteamAppDetails(appId);
  if (!steamData) {
    return c.json({ error: "App not found" }, 404);
  }

  // Save to database
  try {
    const insertedAppId = await InserSteamAppDetails(steamData);
    await Promise.all([
      insertAppPrice(insertedAppId, steamData.price_overview),
      insertAppImages(insertedAppId, steamData.screenshots),
      insertAppMovies(insertedAppId, steamData.movies),
      insertAppCategoryLinks(insertedAppId, steamData.categories, "category"),
      insertAppCategoryLinks(insertedAppId, steamData.genres, "genre"),
      insertAppCompanyLinks(
        insertedAppId,
        steamData.developers,
        steamData.publishers
      ),
    ]);

    // Map and return
    const appSchema = mapSteamAppDetails(steamData);
    return c.json({ data: appSchema });
  } catch (error) {
    console.error("Error saving app to database:", error);
    return c.json({ error: "Failed to save app" }, 500);
  }
});

export { apiRouter };
