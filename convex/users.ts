import { v } from "convex/values";
import type { GenericMutationCtx } from "convex/server";
import { mutation, query } from "./_generated/server";

/**
 * Ensure the current user exists in users table with a role; create as "user" if not.
 * Called by mutations that need role checks.
 */
export async function getOrCreateUser(ctx: GenericMutationCtx<any>) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (existing) return existing;

  await ctx.db.insert("users", {
    clerkId: identity.subject,
    email: identity.email ?? undefined,
    name: identity.name ?? identity.nickname ?? "Anonymous",
    imageUrl: identity.picture ?? undefined,
    role: "user",
  });

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

/**
 * Get current user's role. Returns null if not authenticated or not in users table.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    return user;
  },
});

/**
 * Set a user's role. Only callable by an existing admin (e.g. set first user manually in dashboard).
 * For production, you'd restrict this or use Convex dashboard to set the first admin.
 */
export const setRole = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, { clerkId, role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const current = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!current || current.role !== "admin") throw new Error("Only admins can set roles");
    const target = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (!target) throw new Error("User not found");
    await ctx.db.patch(target._id, { role });
    return target._id;
  },
});
