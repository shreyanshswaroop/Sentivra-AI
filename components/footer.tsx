import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 Sentivra AI 1.0 All rights reserved.
        </p>
      </div>
    </footer>
  );
}