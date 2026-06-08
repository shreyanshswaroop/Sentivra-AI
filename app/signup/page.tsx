"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Mail, User, Lock } from "lucide-react";
import { registerUser } from "@/lib/api/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerUser(name, email, password);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen w-full overflow-hidden flex items-center justify-center relative px-6 bg-gradient-to-br from-[#eef8f3] via-background to-[#dceee7] dark:from-[#081311] dark:via-[#050b0b] dark:to-[#101827]">
    {/* Background Glow */}
    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-300/20 dark:bg-emerald-300/10 rounded-full blur-[140px]" />

    <Container className="relative z-10 flex items-center justify-center w-full">
      <Card
        className="
          w-full
          max-w-md
          p-6 md:p-8
          rounded-[2rem]
          border border-primary/15
          bg-card/90
          dark:bg-[#071111]/90
          backdrop-blur-2xl
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-5">
            <User className="w-6 h-6 text-primary" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Start your private emotional wellness journey with Sentivra.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold mb-2 text-foreground"
            >
              Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                id="name"
                type="text"
                placeholder="Your name"
                className="
                  h-12
                  pl-12
                  rounded-xl
                  bg-background/70
                  dark:bg-white/5
                  border border-primary/20
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/30
                  text-foreground
                  placeholder:text-muted-foreground
                "
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2 text-foreground"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="
                  h-12
                  pl-12
                  rounded-xl
                  bg-background/70
                  dark:bg-white/5
                  border border-primary/20
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/30
                  text-foreground
                  placeholder:text-muted-foreground
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2 text-foreground"
            >
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                id="password"
                type="password"
                placeholder="Create password"
                className="
                  h-12
                  pl-12
                  rounded-xl
                  bg-background/70
                  dark:bg-white/5
                  border border-primary/20
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/30
                  text-foreground
                  placeholder:text-muted-foreground
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold mb-2 text-foreground"
            >
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="
                  h-12
                  pl-12
                  rounded-xl
                  bg-background/70
                  dark:bg-white/5
                  border border-primary/20
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/30
                  text-foreground
                  placeholder:text-muted-foreground
                "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="
              w-full
              h-12
              rounded-xl
              font-semibold
              text-base
              bg-primary
              text-primary-foreground
              hover:bg-primary/90
              shadow-lg
              shadow-primary/20
            "
            size="lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] text-muted-foreground">
            PRIVATE ACCESS
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </Container>
  </div>
);

}
