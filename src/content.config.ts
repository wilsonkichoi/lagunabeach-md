import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// Base content collection schema shared across all locales
const baseContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional().default('LagunaBeach.md Contributors'),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .default('beginner'),
  readingTime: z.number().optional().default(5),
  featured: z.boolean().optional().default(false),
  status: z
    .enum(['draft', 'published', 'archived'])
    .optional()
    .default('published'),
  lastUpdated: z.coerce.date().optional(),
  relatedTopics: z.array(z.string()).optional().default([]),
  sources: z.array(z.string()).optional().default([]),
  subcategory: z.string().optional().default(''),
  // Related diary: Semiont reflection diary written while authoring this article (lets readers see "what was on mind while writing").
  // Each entry takes a diary slug (filename minus .md, Greek letter transliterated, maps to /semiont/diary/{slug}).
  // title / excerpt / date resolved automatically from diary file by RelatedDiaries.astro at build-time.
  // Object form { slug, excerpt } overrides excerpt. Array form, replaces the old single diaryLink / diaryExcerpt.
  relatedDiary: z
    .array(
      z.union([
        z.string(),
        z.object({ slug: z.string(), excerpt: z.string().optional() }),
      ]),
    )
    .optional()
    .default([]),
  // Legacy: single diary teaser (DiaryTeaser). relatedDiary is the successor; new articles use relatedDiary.
  diaryLink: z.string().optional(),
  diaryExcerpt: z.string().optional(),
});

// zh-TW content collection
const zhTWCollection = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    // zh-TW specific fields
    originalTitle: z.string().optional(), // original Chinese title
    alternativeNames: z.array(z.string()).optional().default([]), // alternate names
  }),
});

// English content collection
const enCollection = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    // English-specific fields
    chineseTitle: z.string().optional(), // corresponding Chinese title
    translationStatus: z
      .enum(['complete', 'partial', 'planned'])
      .optional()
      .default('complete'),
  }),
});

// Export collections
export const collections = {
  'zh-TW': zhTWCollection,
  en: enCollection,
};

// Type exports for TypeScript support
export type ZhTWContent = z.infer<typeof baseContentSchema> & {
  originalTitle?: string;
  alternativeNames?: string[];
};

export type EnContent = z.infer<typeof baseContentSchema> & {
  chineseTitle?: string;
  translationStatus?: 'complete' | 'partial' | 'planned';
};
