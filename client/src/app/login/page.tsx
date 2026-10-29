import GoogleSignInButton from "../../components/auth/google-sign-in-button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <section className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Hairdrama Tasks
          </h1>

          <p className="mt-2 text-gray-600">
            Sign in to manage and collaborate on tasks.
          </p>
        </div>

        <GoogleSignInButton />

        <p className="text-center text-xs text-gray-500">
          Sign in with your Google account to continue.
        </p>
      </section>
    </main>
  );
}