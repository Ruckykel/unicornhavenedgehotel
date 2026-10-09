// Sanity schemas from blueprint §8, ready for a Studio (`npm create sanity@latest`,
// then import these into sanity.config.ts). The site currently reads the same
// shapes from src/lib/content.ts; swap those getters for GROQ queries and add
// on-demand revalidation (revalidateTag) from a Sanity webhook.
// This folder is excluded from the site's tsconfig until `sanity` is installed.
import { defineArrayMember, defineField, defineType } from "sanity";

const imageWithAlt = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
});

export const room = defineType({
  name: "room",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "shortDescription", type: "text", rows: 2 }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "priceFrom", title: "Price from (₦ per night)", type: "number" }),
    defineField({ name: "weekendPrice", title: "Weekend price (₦)", type: "number" }),
    defineField({ name: "sizeSqm", title: "Size (m²)", type: "number" }),
    defineField({ name: "bedType", type: "string" }),
    defineField({ name: "maxGuests", type: "number", validation: (r) => r.required().min(1) }),
    defineField({ name: "view", type: "string" }),
    defineField({ name: "keyFeatures", type: "array", of: [{ type: "string" }], validation: (r) => r.max(3) }),
    defineField({ name: "amenities", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "images", type: "array", of: [imageWithAlt] }),
    defineField({ name: "videoTour", type: "url" }),
    defineField({ name: "policies", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "featured", type: "boolean", initialValue: true }),
  ],
});

export const amenity = defineType({
  name: "amenity",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "icon", type: "string", description: "Lucide icon name, e.g. Wifi" }),
    defineField({ name: "group", type: "string", options: { list: ["Rooms", "Business", "Leisure", "Safety"] } }),
    defineField({ name: "highlight", type: "boolean" }),
    defineField({ name: "detail", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const menuCategory = defineType({
  name: "menuCategory",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "order", type: "number" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "description", type: "string" }),
            defineField({ name: "price", type: "number" }),
            defineField({ name: "dietary", type: "array", of: [{ type: "string" }] }),
          ],
        }),
      ],
    }),
  ],
});

export const offer = defineType({
  name: "offer",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "promoCode", type: "string" }),
    defineField({ name: "discountPercent", type: "number" }),
    defineField({ name: "validFrom", type: "date" }),
    defineField({ name: "validTo", type: "date" }),
    defineField({ name: "terms", type: "text" }),
    defineField({ name: "image", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
  ],
});

export const review = defineType({
  name: "review",
  type: "document",
  fields: [
    defineField({ name: "guestName", type: "string" }),
    defineField({ name: "origin", type: "string" }),
    defineField({ name: "quote", type: "text" }),
    defineField({ name: "rating", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "source", type: "string", options: { list: ["Google", "Booking.com", "Direct"] } }),
    defineField({ name: "date", type: "date" }),
  ],
});

export const galleryItem = defineType({
  name: "galleryItem",
  type: "document",
  fields: [
    defineField({ name: "image", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "video", type: "file", options: { accept: "video/*" } }),
    defineField({
      name: "category",
      type: "string",
      options: { list: ["Rooms", "Dining", "Lobby & spaces", "Exterior", "Events", "Video"] },
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const faq = defineType({
  name: "faq",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string" }),
    defineField({ name: "answer", type: "text" }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const siteSettings = defineType({
  name: "siteSettings",
  type: "document",
  fields: [
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "whatsapp", type: "string", description: "International format without +, e.g. 2348031234567" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "address", type: "text" }),
    defineField({ name: "checkInTime", type: "string" }),
    defineField({ name: "checkOutTime", type: "string" }),
    defineField({ name: "socialLinks", type: "object", fields: [defineField({ name: "instagram", type: "url" })] }),
    defineField({ name: "heroVideo", type: "file" }),
    defineField({ name: "heroPoster", type: "image" }),
    defineField({ name: "announcementBar", type: "string" }),
    defineField({ name: "depositPercent", type: "number" }),
    defineField({ name: "allowPayAtHotel", type: "boolean" }),
  ],
});

export const schemaTypes = [room, amenity, menuCategory, offer, review, galleryItem, faq, siteSettings];
