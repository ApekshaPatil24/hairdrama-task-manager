"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCheck,
  CheckCircle2,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  UsersRound,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";

import LogoutButton from "@/components/auth/logout-button";

export type DashboardView =
  | "Overview"
  | "All tasks"
  | "Assigned to me"
  | "Created by me"
  | "Completed";

type NavigationItem = {
  label: string;
  value: DashboardView;
  icon: LucideIcon;
};

type DashboardSidebarProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  userName: string;
  userEmail: string;
  mobile?: boolean;
  onClose?: () => void;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", value: "Overview", icon: LayoutDashboard },
  { label: "Tasks", value: "All tasks", icon: ListTodo },
  { label: "Assigned to me", value: "Assigned to me", icon: UsersRound },
  { label: "Created by me", value: "Created by me", icon: FolderKanban },
  { label: "Completed", value: "Completed", icon: CheckCheck },
];

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export default function DashboardSidebar({
  activeView,
  onViewChange,
  userName,
  userEmail,
  mobile = false,
  onClose,
}: DashboardSidebarProps) {
  return (
    <aside
      aria-label="Dashboard sidebar"
      className={`dashboard-sidebar relative flex h-dvh min-h-0 flex-col overflow-hidden border-r border-[#DDE2D7] bg-[#E8EDE4] text-[#202821] ${
        mobile
  ? "w-[240px] max-w-[88vw] rounded-r-2xl shadow-2xl"
  : "w-full lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-dvh lg:w-[240px]"
      }`}
    >
      {/* Compact decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#244A3D]/[0.07]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-4 h-24 w-24 rounded-full border border-[#D8C8A6]/40"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#D8C8A6]/15 blur-2xl"
      />

      {/* Brand */}
      <div className="relative z-10 flex h-[76px] min-h-[76px] shrink-0 items-center justify-between gap-2 border-b border-[#D8DED2]/80 px-3.5">
        <Link
          href="/"
          aria-label="Hairdrama Tasks home"
          className="flex min-w-0 items-center"
        >
          <Image
            src="/images/brand/hairdrama-tasks-logo-transparent.png"
            alt="Hairdrama Tasks"
            width={3000}
            height={823}
            priority
            className="h-auto w-[155px] max-w-full"
          />
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#687166] transition hover:bg-white hover:text-[#244A3D]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="Dashboard navigation"
        className="relative z-10 min-h-0 flex-1 px-3 pt-6"
      >
        <p className="mb-2.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8A9084]">
          Workspace
        </p>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.value;

            return (
              <button
                key={item.value}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  onViewChange(item.value);
                  onClose?.();
                }}
                className={`dashboard-sidebar-item group flex min-h-[39px] w-full items-center gap-2.5 rounded-[11px] px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white text-[#244A3D] shadow-[0_3px_12px_-9px_rgba(32,40,33,0.25)]"
                    : "bg-transparent text-[#687166] hover:bg-white/65 hover:text-[#244A3D]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] transition-colors duration-200 ${
                    isActive
                      ? "bg-[#E8EDE4] text-[#244A3D]"
                      : "text-[#818A7D] group-hover:text-[#244A3D]"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.9} />
                </span>

                <span className="min-w-0 flex-1 truncate">
                  {item.label}
                </span>

                {isActive && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#A45D42]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Compact help card */}
      <div className="relative z-10 mt-auto shrink-0 px-3 pt-3">
        <div className="dashboard-help-card rounded-xl border border-[#E5E0D5] bg-[#F8F7F2] p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#E2EADD] text-[#31553D]">
              <CircleHelp size={15} />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#29382E]">
                Need a hand?
              </p>
              <p className="mt-0.5 text-[9px] text-[#798174]">
                Your work, simplified
              </p>
            </div>
          </div>

          <p className="mt-2 text-[9px] leading-4 text-[#687166]">
            Keep your priorities clear and make progress one task at a time.
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-semibold text-[#31553D]">
            <CheckCircle2 size={12} />
            <span>One step at a time</span>
          </div>
        </div>
      </div>

      {/* Account and sign out */}
<div className="relative z-10 mt-3 shrink-0 border-t border-[#D8DED2] px-3 pb-3 pt-3">
  {/* Modern sign-out button */}
  <div className="dashboard-sidebar-signout mb-3">
    <span className="dashboard-sidebar-signout-icon" aria-hidden="true">
      <LogOut size={15} strokeWidth={1.9} />
    </span>

    <div className="dashboard-sidebar-logout">
      <LogoutButton />
    </div>
  </div>

  {/* User identity */}
  <div className="flex min-w-0 items-center gap-2">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D8C8A6] text-[10px] font-bold text-[#493E2D]">
      {getInitials(userName)}
    </span>

    <div className="min-w-0 flex-1">
      <p className="truncate text-[10px] font-semibold text-[#303A31]">
        {userName}
      </p>

      <p className="mt-0.5 truncate text-[8px] text-[#848A7E]">
        {userEmail}
      </p>
    </div>

    <CheckCircle2
      size={13}
      className="shrink-0 text-[#6F9271]"
    />
  </div>

  <p className="mt-2.5 text-center text-[8px] font-medium tracking-[0.08em] text-[#8A9084]">
    PLAN · ORGANIZE · GROW
  </p>
</div>
    </aside>
  );
}