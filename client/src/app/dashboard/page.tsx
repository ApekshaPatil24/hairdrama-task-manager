
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardOverview from "@/components/dashboard/dashboard-overview";

export const instant = false;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const metadata = user.user_metadata ?? {};

  const userName =
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    user.email?.split("@")[0] ||
    "Team member";

  return (
    <DashboardOverview
      userName={userName}
      userEmail={user.email ?? ""}
    />
  );
}
