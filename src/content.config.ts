import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
const slug = z.string().regex(/^[a-z][a-z0-9-]*$/);
const localAsset = z
  .string()
  .regex(/^\/images\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|svg)$/);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().startsWith(v),
    "Use a real calendar date",
  );
const https = z.url().refine((v) => v.startsWith("https://"), "HTTPS only");
const apps = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/apps" }),
  schema: z.object({
    slug,
    name: z.string().min(1),
    listingName: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
    visible: z.boolean(),
    order: z.number().int().nonnegative(),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    icon: localAsset,
    launchStatus: z.enum(["preview", "available", "coming-soon"]),
    releaseLabel: z.string(),
    releaseNote: z.string(),
    copy: z
      .object({
        floating: z.string(),
        capture: z.string(),
        featuresEyebrow: z.string(),
        featuresTitle: z.string(),
        galleryEyebrow: z.string(),
        galleryTitle: z.string(),
        usageEyebrow: z.string(),
        downloadTitle: z.string(),
      })
      .optional(),
    hero: z.object({
      line1: z.string(),
      line2: z.string(),
      body: z.string(),
      image: localAsset,
      imageAlt: z.string(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
    storeStatus: z
      .object({
        googlePlay: z.enum(["available", "pending"]).optional(),
        appStore: z.enum(["available", "pending"]).optional(),
      })
      .optional(),
    stores: z.object({
      googlePlay: https.optional(),
      appStore: https.optional(),
    }),
    features: z
      .array(z.object({ title: z.string(), description: z.string() }))
      .min(1),
    screenshots: z.array(
      z.object({
        src: localAsset,
        alt: z.string().min(1),
        caption: z.string(),
        width: z.number().positive(),
        height: z.number().positive(),
      }),
    ),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })),
    usage: z.object({
      title: z.string(),
      body: z.string(),
      notes: z.array(z.string()),
    }),
    requiredDocuments: z
      .array(z.enum(["privacy", "terms"]))
      .length(2)
      .refine(
        (types) => new Set(types).size === 2,
        "Both privacy and terms are required.",
      ),
    disclaimer: z.string(),
  }),
});
const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z
    .object({
      app: slug,
      type: z.enum(["privacy", "terms"]),
      title: z.string().min(1),
      summary: z.string().min(1),
      version: date,
      current: z.boolean(),
      status: z.enum(["draft", "published"]),
      effectiveDate: date.optional(),
      updatedAt: date,
      approvedBy: z.string().optional(),
      reviewItems: z.array(z.string()).default([]),
    })
    .superRefine((v, ctx) => {
      if (
        v.status === "published" &&
        (!v.effectiveDate || !v.approvedBy?.trim() || v.reviewItems.length)
      )
        ctx.addIssue({
          code: "custom",
          message:
            "Published legal documents require effectiveDate, approvedBy, and no open reviewItems.",
        });
    }),
});
export const collections = { apps, legal };
