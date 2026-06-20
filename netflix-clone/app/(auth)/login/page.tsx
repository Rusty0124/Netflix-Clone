"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      await axios.post("/api/auth/login");
      router.push("/manage-profiles");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || "Something went wrong. Please try again.";
        setError(message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-background">
      <div className="w-full max-w-md rounded-lg bg-black/75 p-16">
        <h1 className="mb-7 text-3xl font-bold text-white">Sign In</h1>

        {error && (
          <div className="mb-4 rounded bg-orange-500/10 p-3 text-sm text-orange-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded bg-zinc-800 p-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/40"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-orange-500">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded bg-zinc-800 p-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/40"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-orange-500">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-brand-primary py-3 font-semibold text-white transition hover:bg-brand-primary-dark disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-gray-400">
          New to Netflix?{" "}
          <Link href="/register" className="text-white hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
