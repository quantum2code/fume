import { z } from "zod";

// --- Sub-Schemas ---

const RequirementsSchema = z.union([
  // Steam API quirk: returns an empty array [] if no requirements exist,
  // but an object {} if they do.
  z.object({
    minimum: z.string().optional(),
    recommended: z.string().optional(),
  }),
  z.array(z.unknown()), // Matches the empty array case
]);

const PriceOverviewSchema = z.object({
  currency: z.string(),
  initial: z.number(), // Usually in cents/lowest denomination
  final: z.number(),
  discount_percent: z.number(),
  initial_formatted: z.string().optional(), // Often present in actual API responses
  final_formatted: z.string().optional(), // Often present in actual API responses
});

const PlatformSchema = z.object({
  windows: z.boolean(),
  mac: z.boolean(),
  linux: z.boolean(),
});

const MetacriticSchema = z.object({
  score: z.number().or(z.string()).optional(), // specific check for score type
  url: z.string().optional(),
});

const CategoryGenreSchema = z.object({
  id: z.number().or(z.string()), // ID is usually a string number or number
  description: z.string(),
});

const ScreenshotSchema = z.object({
  id: z.number(),
  path_thumbnail: z.string().url(),
  path_full: z.string().url(),
});

const MovieSchema = z.object({
  id: z.number(),
  name: z.string(),
  thumbnail: z.string().url(),
  webm: z
    .object({
      "480": z.string().url(),
      max: z.string().url(),
    })
    .optional(),
  highlight: z.boolean(),
});

const AchievementSchema = z.object({
  total: z.number(),
  highlighted: z.array(
    z.object({
      name: z.string(),
      path: z.string().url(),
    })
  ),
});

const ReleaseDateSchema = z.object({
  coming_soon: z.boolean(),
  date: z.string(), // Localized string, empty if unannounced
});

const SupportInfoSchema = z.object({
  url: z.string().optional(),
  email: z.string().optional(),
});

const PackageGroupSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  selection_text: z.string(),
  save_text: z.string(),
  display_type: z.number(), // 0 or 1
  is_recurring_subscription: z.string().or(z.boolean()), // 'true'/'false' string or boolean
  subs: z.array(
    z.object({
      packageid: z.number(),
      percent_savings_text: z.string(),
      percent_savings: z.number(),
      option_text: z.string(),
      option_description: z.string(),
      can_get_free_license: z.string().optional(),
      is_free_license: z.boolean().optional(),
      price_in_cents_with_discount: z.number().optional(),
    })
  ),
});

// --- Main App Data Schema ---

export const SteamAppDetailsSchema = z.object({
  type: z.enum([
    "game",
    "dlc",
    "demo",
    "advertising",
    "mod",
    "video",
    "hardware",
    "music",
  ]),
  name: z.string(),
  steam_appid: z.number(),
  required_age: z.number().or(z.string()), // Sometimes "0" or 0
  is_free: z.boolean().optional(), // Often included, good to have
  controller_support: z.enum(["full", "partial"]).optional(),

  // DLC is an array of IDs
  dlc: z.array(z.number()).optional(),

  detailed_description: z.string(), // HTML
  about_the_game: z.string(), // HTML
  short_description: z.string(), // HTML

  fullgame: z
    .object({
      appid: z.string().or(z.number()),
      name: z.string(),
    })
    .nullable()
    .optional(),

  supported_languages: z.string(), // HTML string
  header_image: z.string().url(),
  website: z.string().nullable().optional(),

  pc_requirements: RequirementsSchema.optional(),
  mac_requirements: RequirementsSchema.optional(),
  linux_requirements: RequirementsSchema.optional(),

  legal_notice: z.string().optional(),
  developers: z.array(z.string()).optional(),
  publishers: z.array(z.string()),

  demos: z
    .array(
      z.object({
        appid: z.number().or(z.string()),
        description: z.string().optional(),
      })
    )
    .optional(),

  price_overview: PriceOverviewSchema.optional(),

  packages: z.array(z.number()).optional(),
  package_groups: z.array(PackageGroupSchema).optional(),

  platforms: PlatformSchema.optional(),

  metacritic: MetacriticSchema.optional(),

  categories: z.array(CategoryGenreSchema).optional(),
  genres: z.array(CategoryGenreSchema).optional(),

  screenshots: z.array(ScreenshotSchema).optional(),
  movies: z.array(MovieSchema).optional(),

  recommendations: z
    .object({
      total: z.number(),
    })
    .optional(),

  achievements: AchievementSchema.optional(),

  release_date: ReleaseDateSchema.optional(),
  support_info: SupportInfoSchema.optional(),
  background: z.string().url().optional(),
  background_raw: z.string().url().optional(),
});

// --- Root Response Schema ---

// The API returns an object where keys are the AppIDs (strings).
// e.g. { "570": { success: true, data: { ... } } }
export const SteamApiResponseSchema = z.record(
  z.string(), // The key is the App ID
  z.object({
    success: z.boolean(),
    data: SteamAppDetailsSchema.optional(), // Data is missing if success is false
  })
);

// Type inference
export type SteamApiResponse = z.infer<typeof SteamApiResponseSchema>;
export type SteamAppDetails = z.infer<typeof SteamAppDetailsSchema>;
