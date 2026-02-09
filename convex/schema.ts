import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * HypeShelf schema:
 * - users: one row per Clerk user; stores role (admin | user) for RBAC.
 * - recommendations: each "hype" with title, genres, link, blurb, author info, staffPick.
 */
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
  })
    .index("by_clerk_id", ["clerkId"]),

  recommendations: defineTable({
    title: v.string(),
    genres: v.array(v.string()),
    link: v.optional(v.string()),
    blurb: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
    isStaffPick: v.boolean(),
  })
    .index("by_author", ["authorId"])
    .index("by_staff_pick", ["isStaffPick"]),
});
