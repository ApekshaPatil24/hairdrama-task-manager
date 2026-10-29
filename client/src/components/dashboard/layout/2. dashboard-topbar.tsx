"use client";

import {
  Bell,
  CalendarDays,
  Menu,
  Search,
  ShieldCheck,
  X, // Fixed: imported X icon
} from "lucide-react";

import type { DashboardView } from "./1. dashboard-sidebar";

type DashboardTopbarProps = {
  userName: string;
  userEmail: string;
  activeView: DashboardView;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  onNotificationClick: () => void;
};

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

export default function DashboardTopbar({
  userName,
  userEmail,
  activeView,
  searchQuery,
  onSearchChange,
  onMenuClick,
  onNotificationClick,
}: DashboardTopbarProps) {
  const firstName = userName.trim().split(/\s+/)[0] || "there";

  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  const pageTitle =
    activeView === "Overview" ? "Workspace overview" : activeView;

  return (
    <header className="dashboard-topbar fixed inset-x-0 top-0 z-[60] shrink-0 lg:left-[240px]">
      <div className="dashboard-topbar-inner flex min-h-[82px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-7">
        {/* Workspace identity */}
        <div className="flex min-w-0 flex-[1_1_220px] items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open dashboard navigation"
            className="dashboard-icon-button flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E0D5] bg-white text-[#244A3D] transition hover:bg-[#E8EDE4] lg:hidden"
          >
            <Menu size={18} strokeWidth={1.8} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="hidden h-2 w-2 rounded-full bg-[#719373] shadow-[0_0_0_3px_rgba(113,147,115,.12)] sm:block" />

              <p className="truncate text-[9px] font-semibold uppercase tracking-[.16em] text-[#858D80] sm:text-[10px]">
                HAIRDRAMA / WORKSPACE
              </p>
            </div>

            <h1 className="mt-1 truncate font-heading text-[15px] font-bold tracking-[-.035em] text-[#202821] sm:text-[18px]">
              {pageTitle}
            </h1>

            <p className="mt-0.5 hidden text-[10px] text-[#848A7E] xl:block">
              A clearer view of what matters today.
            </p>
          </div>
        </div>

        {/* Search */}
        <label className="dashboard-topbar-search group hidden min-w-0 flex-[0_1_340px] items-center gap-3 rounded-2xl border border-[#E7E5DC] bg-white/85 p-2 md:flex">
          <span className="dashboard-search-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F3EC] text-[#637B68] transition-all duration-300 group-focus-within:bg-[#244A3D] group-focus-within:text-white">
            <Search size={16} strokeWidth={1.8} />
          </span>

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, projects, people..."
            aria-label="Search dashboard tasks"
            className="min-w-0 flex-1 bg-transparent py-2 text-[12px] text-[#202821] outline-none placeholder:text-[#A0A397]"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#899084] transition-colors hover:bg-[#F0F3EC] hover:text-[#244A3D]"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="shrink-0 rounded-lg border border-[#E8E5DB] bg-[#F8F7F2] px-2 py-1.5 text-[10px] font-medium text-[#899084]">
              /
            </kbd>
          )}
        </label>

        {/* Date, notifications and profile */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2.5 rounded-[14px] border border-[#E7E5DC] bg-white/75 px-3 py-2.5 xl:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#F0E6D6] text-[#75563B]">
              <CalendarDays size={15} strokeWidth={1.8} />
            </span>

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[.12em] text-[#92978B]">
                TODAY
              </p>

              <p className="mt-0.5 text-[10px] font-semibold text-[#455548]">
                {dateLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNotificationClick}
            aria-label="Open notifications"
            className="dashboard-icon-button relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] border border-[#E5E0D5] bg-white text-[#596B5C] transition-all duration-200 hover:border-[#D2DDCC] hover:bg-[#EDF1E8] hover:text-[#244A3D]"
          >
            <Bell size={17} strokeWidth={1.8} />

            <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-[#A45D42]" />
          </button>

          {/* User identity */}
          <div
            title={userEmail}
            className="flex min-w-0 items-center gap-2 rounded-[15px] border border-[#E5E0D5] bg-white/90 p-1.5 pr-2.5 sm:gap-2.5 sm:pr-3"
          >
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] bg-[#D8C8A6] font-heading text-[11px] font-bold text-[#493E2D]">
              {getInitials(userName)}
            </span>

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[100px] truncate text-[10px] font-semibold text-[#303A31] xl:max-w-[125px]">
                {userName || firstName}
              </p>

              <p className="mt-0.5 flex items-center gap-1 text-[9px] text-[#858D80]">
                <ShieldCheck size={10} className="text-[#719373]" />
                Workspace member
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brand accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#B8C9B2]/65 to-transparent" />
    </header>
  );
}