"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { useSession } from "@/lib/contexts/session-context";

export default function LoginPage() {
  const router = useRouter();
  const { checkSession } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginUser(email, password);

      // Store the token in localStorage
      localStorage.setItem("token", response.token);

      // Update session state
      await checkSession();

      // Wait for state to update before redirecting
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen w-full overflow-hidden flex items-center justify-center relative px-6 bg-gradient-to-br from-[#eef8f3] via-background to-[#dceee7] dark:from-[#081311] dark:via-[#050b0b] dark:to-[#101827]">
    {/* Background glow */}
    <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-primary/20 rounded-full blur-[140px]" />
    <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] bg-emerald-300/20 dark:bg-emerald-300/10 rounded-full blur-[140px]" />

    <Container className="relative z-10 grid lg:grid-cols-2 items-center gap-10 w-full max-w-6xl">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-center">
        <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
          Welcome back to{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-500 dark:to-emerald-200 bg-clip-text text-transparent">
            Sentivra
          </span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
          Continue your private wellness journey with emotionally intelligent AI
          support designed to listen, understand, and guide you.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-xl mt-8">
          <div className="rounded-2xl border border-primary/15 bg-card/80 dark:bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-primary font-semibold">Private by Design</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your thoughts stay secure and confidential.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card/80 dark:bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-primary font-semibold">Always Available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Emotional support whenever you need it.
            </p>
          </div>
        </div>
      </div>

      {/* Sign In Card */}
      <Card className="w-full max-w-xl mx-auto p-8 md:p-10 rounded-[2rem] border border-primary/15 bg-card/90 dark:bg-[#071111]/90 backdrop-blur-2xl shadow-2xl">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Nice to see you again
          </h2>

          <p className="mt-3 text-muted-foreground text-base">
            Sign in to continue your emotional wellness journey.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="h-14 pl-12 rounded-2xl bg-background/70 dark:bg-white/5 border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="h-14 pl-12 rounded-2xl bg-background/70 dark:bg-white/5 border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <Button
            className="w-full h-14 rounded-2xl font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            size="lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">SECURE ACCESS</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Don&apos;t have an account?
          </span>{" "}
          <Link href="/signup" className="text-primary font-semibold hover:text-primary/80">
            Create one
          </Link>
        </div>
      </Card>
    </Container>
  </div>
);
}
