/**
 * Mirrors Convex schema. After running `npx convex dev`, you can use
 * Doc<"recommendations"> and Id<"recommendations"> from convex/_generated/dataModel instead.
 */
export type RecommendationId = string;

export interface Recommendation {
  _id: RecommendationId;
  _creationTime: number;
  title: string;
  genres: string[];
  link?: string;
  blurb: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  isStaffPick: boolean;
}
