import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postSchema = z.object({
  layout: z.string().optional(),
  title: z.coerce.string(),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).optional().default([]),
  categories: z.union([z.string(), z.array(z.string())]).optional(),
});

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/i, ""),
  }),
  schema: postSchema,
});

const pages = defineCollection({
  loader: glob({ pattern: "about.md", base: "./src/content" }),
  schema: z.object({
    layout: z.string().optional(),
  }),
});

export const collections = { posts, pages };
