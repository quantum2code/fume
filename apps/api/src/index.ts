import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { apiRouter } from "./routes/router.js";

const app = new Hono({ strict: false });

app.get("/", async (c) => {
  return c.json({ status: "live" });
});

app.route("/api", apiRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
