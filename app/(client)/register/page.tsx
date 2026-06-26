"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { openGoogleSignInPopup } from "@/lib/auth/googlePopup";

const getSafeNextPath = (value: string | null) => {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
};

const RegisterPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({ error: "Register failed" }));
        setError(data.error || "Register failed");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Unable to register right now");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await openGoogleSignInPopup(nextPath);
      if (result.success) {
        router.push(result.nextPath);
        router.refresh();
      }
    } catch {
      setError("Unable to sign in with Google right now");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>
          <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wide text-lightColor">
            <span className="h-px flex-1 bg-gray-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="inline-flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold hover:bg-shop_light_bg hoverEffect disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </button>
          <p className="text-sm text-center mt-4 text-lightColor">
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(nextPath)}`}
              className="text-shop_btn_dark_green font-semibold"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </Container>
  );
};

const RegisterPage = () => {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
};

export default RegisterPage;
