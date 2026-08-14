import { createDirectus, rest, staticToken } from "@directus/sdk";

const directusUrl = process.env.DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_TOKEN;

if (!directusUrl) {
  throw new Error("DIRECTUS_URL is not configured");
}

if (!directusToken) {
  throw new Error("DIRECTUS_TOKEN is not configured");
}

export const directus = createDirectus(directusUrl)
  .with(staticToken(directusToken))
  .with(rest());