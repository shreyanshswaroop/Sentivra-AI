"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-5xl font-semibold tracking-tight">
          Coming Soon
        </h1>

        <p className="mt-4 text-muted-foreground text-lg">
          We're crafting something special for Sentivra.
          This experience will be available soon.
        </p>

        <div className="mt-8">
          <Link href="/">
            <Button className="rounded-full px-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}