"use client";

import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import type { Recommendation } from "@/types/convex";
import RecCard from "@/components/hypes/RecCard";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const { isSignedIn } = useUser();

  const result = useQuery(api.recommendations.listLatest, {});
  const items = result?.items ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="text-center py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">
          Collect and share the stuff you&apos;re hyped about
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Discover amazing movie recommendations from your community - share
          what you&apos;re hyped about.
        </p>
        <div className="mt-8">
          {isSignedIn ? (
            <Link
              href="/all-hypes"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
            >
              <span aria-hidden className="text-lg">+</span>
              Go to All Hypes
            </Link>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/all-hypes">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
                <span aria-hidden className="text-lg">+</span>
                Sign in to add yours
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* Latest Hypes */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Latest Hypes
        </h2>
        {items.length === 0 && result !== undefined ? (
          <p className="mt-6 text-zinc-500 dark:text-zinc-400">
            No movies yet. Sign in to add the first one.
          </p>
        ) : (
          <>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((rec) => (
                <li key={(rec as Recommendation & { _id: string })._id}>
                  <RecCard rec={rec as Recommendation} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
