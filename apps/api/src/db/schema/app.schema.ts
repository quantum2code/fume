import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
  numeric,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";

// Table
export const app = pgTable("app", {
  id: serial("id").primaryKey(),
  steamAppId: integer("steam_appid").notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  requiredAge: integer("required_age"),
  heroImage: varchar("hero_image").notNull(),
  website: varchar("website"),
  controllerSupport: varchar("controller_support"),
  legalNotice: text("legal_notice"),
  descriptionShort: varchar("description_short").notNull(),
  descriptionDetailed: text("description_detailed"),
  languagesSupported: text("languages_supported"),
  metacriticData: jsonb("metacritic_data"),
  releaseDateInfo: jsonb("release_date_info").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const company = pgTable("company", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type"),
});

//Junction Tables
export const appPrice = pgTable("app_price", {
  appId: integer("app_id")
    .primaryKey()
    .references(() => app.id),
  currencyCode: varchar("currency_code").notNull(),
  priceInitial: integer("price_initial").notNull(), // Stored in cents
  priceFinal: integer("price_final").notNull(), // Stored in cents
  discountPercent: integer("discount_percent").notNull(),
});

export const appCategoryLink = pgTable(
  "app_category_link",
  {
    appId: integer("app_id")
      .notNull()
      .references(() => app.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => category.id),
  },
  (t) => [primaryKey({ columns: [t.appId, t.categoryId] })]
);

export const appImages = pgTable("app_images", {
  id: serial("id").primaryKey(),
  appId: integer("app_id")
    .notNull()
    .references(() => app.id),
  pathThumbnail: text("path_thumbnail"),
  pathFull: text("path_full"),
});

export const appMovies = pgTable("app_movies", {
  id: serial("id").primaryKey(),
  appId: integer("app_id")
    .notNull()
    .references(() => app.id),
  name: varchar("name"),
  thumbnail: text("thumbnail"),
  url480p: text("url_480p"),
  urlMax: text("url_max"),
});

export const appContentLink = pgTable(
  "app_content_link",
  {
    parentAppId: integer("parent_app_id")
      .notNull()
      .references(() => app.id),
    childAppId: integer("child_app_id")
      .notNull()
      .references(() => app.id),
    type: varchar("type").notNull(), // e.g., "dlc", "music"
  },
  (t) => [primaryKey({ columns: [t.parentAppId, t.childAppId, t.type] })]
);

export const appCompanyLink = pgTable(
  "app_company_link",
  {
    appId: integer("app_id")
      .notNull()
      .references(() => app.id),
    companyId: integer("company_id")
      .notNull()
      .references(() => company.id),
    role: varchar("role").notNull(), // e.g., "developer", "publisher"
  },
  (t) => [primaryKey({ columns: [t.appId, t.companyId, t.role] })]
);

export const appAchievement = pgTable("app_achievement", {
  id: serial("id").primaryKey(),
  appId: integer("app_id")
    .notNull()
    .references(() => app.id),
  name: varchar("name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  globalPercent: numeric("global_percent"),
});

export const userAchievementStatus = pgTable(
  "user_achievement_status",
  {
    userId: integer("user_id").notNull(),
    achievementId: integer("achievement_id")
      .notNull()
      .references(() => appAchievement.id),
    isUnlocked: boolean("is_unlocked").notNull().default(false),
    unlockedAt: timestamp("unlocked_at"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.achievementId] })]
);

export const appRequirement = pgTable("app_requirement", {
  id: serial("id").primaryKey(),
  appId: integer("app_id")
    .notNull()
    .references(() => app.id),
  platform: varchar("platform").notNull(), // win, mac, linux
  specType: varchar("spec_type").notNull(), // min, recommended
  description: text("description").notNull(), // Usually JSON text in Steam, strictly text here
});

//Relations
export const appImagesRelations = relations(appImages, ({ one }) => ({
  app: one(app, {
    fields: [appImages.appId],
    references: [app.id],
  }),
}));

export const appMoviesRelations = relations(appMovies, ({ one }) => ({
  app: one(app, {
    fields: [appMovies.appId],
    references: [app.id],
  }),
}));

export const appAchievementRelations = relations(appAchievement, ({ one }) => ({
  app: one(app, {
    fields: [appAchievement.appId],
    references: [app.id],
  }),
}));

export const appRequirementRelations = relations(appRequirement, ({ one }) => ({
  app: one(app, {
    fields: [appRequirement.appId],
    references: [app.id],
  }),
}));

export const companyRelation = relations(company, ({ many }) => ({
  link: many(appCompanyLink),
}));

export const appRelations = relations(app, ({ one, many }) => ({
  price: one(appPrice, {
    fields: [app.id],
    references: [appPrice.appId],
  }),
  companies: many(appCompanyLink),
  categories: many(appCategoryLink),
  images: many(appImages),
  movies: many(appMovies),
  achievements: many(appAchievement),
  requirements: many(appRequirement),
  parents: many(appContentLink, { relationName: "child" }),
  children: many(appContentLink, { relationName: "parent" }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  apps: many(appCategoryLink),
}));

export const appCategoryRelations = relations(appCategoryLink, ({ one }) => ({
  app: one(app, {
    fields: [appCategoryLink.appId],
    references: [app.id],
  }),
  category: one(category, {
    fields: [appCategoryLink.categoryId],
    references: [category.id],
  }),
}));

export const appCompanyLinkRelations = relations(appCompanyLink, ({ one }) => ({
  app: one(app, {
    fields: [appCompanyLink.appId],
    references: [app.id],
  }),
  company: one(company, {
    fields: [appCompanyLink.companyId],
    references: [company.id],
  }),
}));

export const appContentLinkRelations = relations(appContentLink, ({ one }) => ({
  parent: one(app, {
    fields: [appContentLink.parentAppId],
    references: [app.id],
    relationName: "parent",
  }),
  child: one(app, {
    fields: [appContentLink.childAppId],
    references: [app.id],
    relationName: "child",
  }),
}));
