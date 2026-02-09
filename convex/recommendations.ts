import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getOrCreateUser } from "./users";

const PUBLIC_PAGE_SIZE = 6; // Number of movies to display on the public page

/**
 * List latest recommendations for the public page (read-only, no auth required).
 */
export const listLatest = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("recommendations")
      .order("desc")
      .take(PUBLIC_PAGE_SIZE);
    return { items, nextCursor: null };
  },
});

const LIST_PAGE_SIZE = 6;

/**
 * List recommendations (authenticated view) with optional genre, scope, and pagination.
 * Returns { items, nextCursor } for "Load more" on all-hypes page.
 */
export const list = query({
  args: {
    genre: v.optional(v.string()),
    scope: v.optional(
      v.union(v.literal("all"), v.literal("my"), v.literal("staffPicks"))
    ),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { genre, scope, cursor, limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    let items = await ctx.db.query("recommendations").order("desc").collect();

    if (scope === "my") {
      items = items.filter((r) => r.authorId === identity.subject);
    } else if (scope === "staffPicks") {
      items = items.filter((r) => r.isStaffPick);
    }

    if (genre && genre !== "All") {
      items = items.filter((r) =>
        r.genres.some(
          (g: string) => g.toLowerCase() === genre.toLowerCase()
        )
      );
    }

    const pageSize = limit ?? LIST_PAGE_SIZE;
    const startIndex = cursor
      ? Math.max(
          0,
          items.findIndex((r) => r._creationTime.toString() === cursor) + 1
        )
      : 0;
    const page = items.slice(startIndex, startIndex + pageSize);
    const hasMore = items.length > startIndex + pageSize;
    const nextCursor = hasMore
      ? page[page.length - 1]!._creationTime.toString()
      : null;
    return { items: page, nextCursor };
  },
});

/**
 * Add a recommendation. Requires auth; user must exist (created on first action).
 */
export const add = mutation({
  args: {
    title: v.string(),
    genres: v.array(v.string()),
    link: v.optional(v.string()),
    blurb: v.string(),
  },
  handler: async (ctx, { title, genres, link, blurb }) => {
    const user = await getOrCreateUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.insert("recommendations", {
      title: title.trim(),
      genres: genres.map((g) => g.trim()).filter(Boolean),
      link: link?.trim() || undefined,
      blurb: blurb.trim(),
      authorId: user.clerkId,
      authorName: user.name,
      authorImageUrl: user.imageUrl,
      isStaffPick: false,
    });
  },
});

/**
 * Delete a recommendation. User can delete own; admin can delete any.
 */
export const remove = mutation({
  args: { id: v.id("recommendations") },
  handler: async (ctx, { id }) => {
    const user = await getOrCreateUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const rec = await ctx.db.get(id);
    if (!rec) throw new Error("Recommendation not found");

    const isOwner = rec.authorId === user.clerkId;
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) throw new Error("You can only delete your own recommendations");

    await ctx.db.delete(id);
  },
});

/**
 * Toggle staff pick. Admin only.
 */
export const setStaffPick = mutation({
  args: {
    id: v.id("recommendations"),
    isStaffPick: v.boolean(),
  },
  handler: async (ctx, { id, isStaffPick }) => {
    const user = await getOrCreateUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.role !== "admin") throw new Error("Only admins can set Staff Pick");

    const rec = await ctx.db.get(id);
    if (!rec) throw new Error("Recommendation not found");

    await ctx.db.patch(id, { isStaffPick });
  },
});
