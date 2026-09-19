import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [mdx()],
  site: "https://andywu1998.github.io",
  base: "/astro_demo",
  output: "static",
});
