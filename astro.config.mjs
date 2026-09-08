import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://rok.gg",
  output: "static",
  trailingSlash: "ignore",
  build: { format: "directory" },
});
