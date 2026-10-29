
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleGoogleSignIn() {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch {
      setErrorMessage(
        "Unable to start sign-in. Check your Supabase configuration."
      );
      setLoading(false);
    }
  }

  
return (
  <div className="w-full">
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      aria-busy={loading}
      className="group flex min-h-[54px] w-full items-center justify-center gap-3 rounded-2xl border border-[#244A3D] bg-[#244A3D] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_22px_-13px_rgba(36,74,61,.65)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#19382E] hover:shadow-[0_12px_28px_-15px_rgba(36,74,61,.55)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
        <svg
          aria-hidden="true"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.14 3.57-8.85Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.29v3.09A12 12 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.37-2.29V6.62H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.99-3.09Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.45-3.45A11.54 11.54 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.99 3.09C6.23 6.87 8.88 4.76 12 4.76Z"
          />
        </svg>
      </span>

      <span>
        {loading ? "Connecting to Google..." : "Continue with Google"}
      </span>
    </button>

    {errorMessage && (
      <p
        className="mt-3 rounded-xl border border-[#E8C9BD] bg-[#FBF0EC] px-3 py-2.5 text-center text-xs leading-5 text-[#914F38]"
        role="alert"
      >
        {errorMessage}
      </p>
    )}
  </div>
);
}
