import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Sign-in unsuccessful</h1>

      <p>
        We couldn't complete Google sign-in. Please try again.
      </p>

      <Link
        href="/login"
        className="rounded-lg bg-black px-5 py-3 text-white"
      >
        Return to login
      </Link>
    </main>
  );
}