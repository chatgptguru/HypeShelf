"use client";

const DEFAULT_GENRES = ["All", "Horror", "Comedy", "Action", "Sci-Fi", "Drama", "Fantasy", "Thriller", "Romance", "Documentary", "Animation"];

interface GenreFilterProps {
  value: string;
  onChange: (genre: string) => void;
  extraGenres?: string[];
}

export default function GenreFilter({
  value,
  onChange,
  extraGenres = [],
}: GenreFilterProps) {
  const options = [...new Set([...DEFAULT_GENRES, ...extraGenres])];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Filter by:
      </span>
      {options.map((genre) => (
        <button
          key={genre}
          type="button"
          onClick={() => onChange(genre)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === genre
              ? "bg-primary-600 text-white dark:bg-primary-500"
              : "border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-700 dark:text-zinc-300 hover:border-primary-500/50 hover:bg-primary-500/10"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
