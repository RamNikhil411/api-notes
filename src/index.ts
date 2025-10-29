import { serve } from "@hono/node-server";
import { Hono } from "hono";
import routes from "./routes/index.js";

const app = new Hono();

app.route("/", routes);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
