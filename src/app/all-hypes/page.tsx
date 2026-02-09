"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Recommendation } from "@/types/convex";
import RecCard from "@/components/hypes/RecCard";
import GenreFilter from "@/components/hypes/GenreFilter";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";

type Scope = "all" | "my" | "staffPicks";

function AllHypesContent() {
  const [scope, setScope] = useState<Scope>("all");
  const [genre, setGenre] = useState("All");
  const [cursor, setCursor] = useState<string | null>(null);
  const [accumulated, setAccumulated] = useState<(Recommendation & { _id: string })[]>([]);

  const listResult = useQuery(api.recommendations.list, {
    genre: genre === "All" ? undefined : genre,
    scope: scope === "all" ? undefined : scope,
    cursor: cursor ?? undefined,
  });

  useEffect(() => {
    if (listResult == null) return;
    const page = (listResult.items ?? []) as (Recommendation & { _id: string })[];
    if (cursor == null) {
      setAccumulated(page);
    } else {
      setAccumulated((prev) => {
        const ids = new Set(prev.map((r) => r._id));
        const newItems = page.filter((r) => !ids.has(r._id));
        return [...prev, ...newItems];
      });
    }
  }, [listResult, cursor]);

  const nextCursor = listResult?.nextCursor ?? null;
  const currentUser = useQuery(api.users.getCurrentUser);
  const removeRec = useMutation(api.recommendations.remove);
  const setStaffPick = useMutation(api.recommendations.setStaffPick);

  const isAdmin = currentUser?.role === "admin";
  const clerkId = currentUser?.clerkId;

  const resetPagination = () => {
    setCursor(null);
    setAccumulated([]);
  };

  const handleScopeChange = (s: Scope) => {
    setScope(s);
    resetPagination();
  };

  const handleGenreChange = (g: string) => {
    setGenre(g);
    resetPagination();
  };

  const handleLoadMore = () => {
    if (nextCursor) setCursor(nextCursor);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this movie?")) {
      try {
        await removeRec({ id: id as any });
        setAccumulated((prev) => prev.filter((r) => r._id !== id));
      } catch (e) {
        alert((e as Error).message);
      }
    }
  };

  const handleToggleStaffPick = async (id: string, value: boolean) => {
    try {
      await setStaffPick({ id: id as any, isStaffPick: value });
      setAccumulated((prev) => {
        if (scope === "staffPicks" && !value) {
          return prev.filter((r) => r._id !== id);
        }
        return prev.map((r) =>
          r._id === id ? { ...r, isStaffPick: value } : r
        );
      });
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const allRecs = accumulated;
  const allGenres = Array.from(
    new Set(allRecs.flatMap((r) => r.genres))
  ).sort();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          All hypes
        </h1>
        <Link
          href="/all-hypes/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + Add movie
        </Link>
      </div>

      <section className="mt-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Show:
          </span>
          {(
            [
              { value: "all" as Scope, label: "All" },
              { value: "my" as Scope, label: "My hypes" },
              { value: "staffPicks" as Scope, label: "Staff picks" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleScopeChange(value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                scope === value
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-700 dark:text-zinc-300 hover:border-primary-500/50 hover:bg-primary-500/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <GenreFilter
          value={genre}
          onChange={handleGenreChange}
          extraGenres={allGenres}
        />
      </section>

      {allRecs.length === 0 ? (
        <p className="mt-8 text-zinc-500 dark:text-zinc-400">
          No movies yet. Add one above.
        </p>
      ) : (
        <>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allRecs.map((rec) => (
              <li key={rec._id}>
                <RecCard
                  rec={rec}
                  showActions
                  isAdmin={isAdmin}
                  isOwner={rec.authorId === clerkId}
                  onDelete={handleDelete}
                  onToggleStaffPick={handleToggleStaffPick}
                />
              </li>
            ))}
          </ul>
          {nextCursor && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="rounded-xl border border-zinc-300 dark:border-zinc-600 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Load More Hypes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AllHypesPage() {
  return (
    <>
      <Unauthenticated>
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to view and manage your movie recommendations.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </Unauthenticated>
      <Authenticated>
        <AllHypesContent />
      </Authenticated>
    </>
  );
}
