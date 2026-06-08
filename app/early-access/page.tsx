"use client";

import { useState } from "react";
import { Heart, ArrowRight, CheckCircle } from "lucide-react";

export default function EarlyAccessPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border bg-background/60 shadow-sm">
          {success ? (
            <CheckCircle className="h-7 w-7 text-primary" />
          ) : (
            <Heart className="h-7 w-7 text-primary" />
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-5">
          Request Early Access
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          Join the first group of users helping shape Sentivra AI — a calmer,
          private, and more intelligent space for mental wellness.
        </p>

        {success ? (
          <div className="rounded-2xl border bg-card/50 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">
              You're on the list.
            </h2>
            <p className="text-muted-foreground">
              We'll notify you when Sentivra Early Access becomes available.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-card/50 p-6 md:p-8 shadow-sm backdrop-blur"
          >
            <div className="space-y-4 text-left">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500 text-left">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Request Early Access"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>

            <p className="mt-5 text-xs text-muted-foreground">
              No spam. Just early access updates from Sentivra AI.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}