export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800 py-10">
      <div className="flex flex-col gap-4 items-center justify-between">
        <div>
          <div className="flex justify-center items-center gap-2 font-semibold text-zinc-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm">
              H
            </span>
            HypeShelf
          </div>
          <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            The best place to discover and share movie recommendations.
          </p>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © 2026 HypeShelf. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
