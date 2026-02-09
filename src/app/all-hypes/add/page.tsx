"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";

const SUGGESTED_GENRES = [
  "Horror",
  "Comedy",
  "Action",
  "Sci-Fi",
  "Drama",
  "Fantasy",
  "Thriller",
  "Romance",
  "Documentary",
  "Animation",
];

function AddForm() {
  const router = useRouter();
  const addRec = useMutation(api.recommendations.add);
  const [title, setTitle] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const [link, setLink] = useState("");
  const [blurb, setBlurb] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addGenre = (g: string) => {
    const t = g.trim();
    if (t && !genres.includes(t)) setGenres([...genres, t]);
    setGenreInput("");
  };

  const removeGenre = (g: string) => {
    setGenres(genres.filter((x) => x !== g));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (genres.length === 0) {
      setError("Add at least one genre.");
      return;
    }
    if (!blurb.trim()) {
      setError("Blurb is required.");
      return;
    }
    setSubmitting(true);
    try {
      await addRec({
        title: title.trim(),
        genres,
        link: link.trim() || undefined,
        blurb: blurb.trim(),
      });
      router.push("/all-hypes");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Add a movie
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <p className="rounded-lg bg-red-100 dark:bg-red-900/30 px-4 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dune: Part Two"
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Genres
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {genres.map((g) => (
              <span
                key={g}
                className="inline-flex items-center gap-1 rounded-full bg-primary-500/20 px-3 py-1 text-sm text-primary-700 dark:text-primary-300"
              >
                {g}
                <button
                  type="button"
                  onClick={() => removeGenre(g)}
                  className="hover:opacity-80"
                  aria-label={`Remove ${g}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGenre(genreInput);
                }
              }}
              placeholder="Add genre..."
              className="w-28 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1 text-sm text-zinc-900 dark:text-white"
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Or click:{" "}
            {SUGGESTED_GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => addGenre(g)}
                className="mr-1 text-primary-600 dark:text-primary-400 hover:underline"
              >
                {g}
              </button>
            ))}
          </p>
        </div>
        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Link (optional)
          </label>
          <input
            id="link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label
            htmlFor="blurb"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Short blurb
          </label>
          <textarea
            id="blurb"
            rows={4}
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            placeholder="A few sentences about why you recommend this movie..."
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "Adding…" : "Add movie"}
          </button>
          <Link
            href="/all-hypes"
            className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AddRecPage() {
  return (
    <>
      <Unauthenticated>
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to add a movie.
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
        <AddForm />
      </Authenticated>
    </>
  );
}
