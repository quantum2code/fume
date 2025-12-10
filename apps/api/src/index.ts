import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./db/db.js";

const app = new Hono();

app.get("/", async (c) => {
  const appRow = await db.query.app.findFirst({
    with: {
      companies: {
        with: {
          company: true,
        },
      },
      images: true,
      movies: true,
      achievements: true,
      requirements: true,
      parents: true,
      children: true,
    },
  });
  if (!appRow) return c.json({ success: false });
  return c.json(appRow);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export { app };
