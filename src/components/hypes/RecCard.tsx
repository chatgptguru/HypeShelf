"use client";

import Image from "next/image";
import type { Recommendation, RecommendationId } from "@/types/convex";

interface RecCardProps {
  rec: Recommendation;
  showActions?: boolean;
  isAdmin?: boolean;
  isOwner?: boolean;
  onDelete?: (id: RecommendationId) => void;
  onToggleStaffPick?: (id: RecommendationId, value: boolean) => void;
}

export default function RecCard({
  rec,
  showActions = false,
  isAdmin = false,
  isOwner = false,
  onDelete,
  onToggleStaffPick,
}: RecCardProps) {
  const canDelete = isAdmin || isOwner;
  const canStaffPick = isAdmin;

  return (
    <article className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 p-5 transition hover:border-primary-500/30 dark:hover:border-primary-500/30">
      {rec.isStaffPick && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-xs font-medium text-white">
          <span aria-hidden>★</span> Staff Pick
        </span>
      )}
      <h3 className="pr-24 text-lg font-semibold text-zinc-900 dark:text-white">
        {rec.link ? (
          <a
            href={rec.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-500 hover:underline"
          >
            {rec.title}
          </a>
        ) : (
          rec.title
        )}
      </h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {rec.genres.map((g) => (
          <span
            key={g}
            className="rounded-full bg-primary-500/20 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
          >
            {g}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
        {rec.blurb}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          {rec.authorImageUrl ? (
            <Image
              src={rec.authorImageUrl}
              alt=""
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/30 text-xs font-medium text-primary-700 dark:text-primary-300">
              {rec.authorName.charAt(0)}
            </span>
          )}
          <span>Added by {rec.authorName}</span>
        </div>
        {showActions && (canDelete || canStaffPick) && (
          <div className="flex items-center gap-1">
            {canStaffPick && (
              <button
                type="button"
                onClick={() => onToggleStaffPick?.(rec._id, !rec.isStaffPick)}
                className="rounded px-2 py-1 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 whitespace-nowrap"
              >
                {rec.isStaffPick ? "Unpick" : "Staff Pick"}
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete?.(rec._id)}
                className="rounded px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
