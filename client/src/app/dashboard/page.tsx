import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const metadata = user.user_metadata ?? {};
  const name =
    metadata.full_name ??
    metadata.name ??
    user.email ??
    "User";

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {name}
            </h1>

            <p className="mt-2 text-gray-600">
              {user.email}
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-8 rounded-xl bg-gray-50 p-5">
          <h2 className="text-xl font-semibold">
            Your task dashboard
          </h2>

          <p className="mt-2 text-gray-600">
            Authentication is working. Task management will be
            added in the next development phase.
          </p>
        </div>
      </div>
    </main>
  );
}