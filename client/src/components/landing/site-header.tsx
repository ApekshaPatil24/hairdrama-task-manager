
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";


type SiteHeaderProps = {
  variant?: "landing" | "inner";
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About Us", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function SiteHeader({
  variant = "landing",
}: SiteHeaderProps) {
  const isLanding = variant === "landing";

  function getNavHref(href: string, label: string) {
    if (isLanding) return href;
    return label === "Home" ? "/" : `/${href}`;
  }

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-[#E5E0D5]/70 bg-[#F8F7F2]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="relative flex min-h-[68px] items-center justify-between gap-3 sm:min-h-[76px]">
          {/* Brand */}
          <Link
            href="/"
            aria-label="Hairdrama Tasks home"
            className="group flex shrink-0 items-center"
          >
            <Image
              src="/images/brand/hairdrama-tasks-logo-transparent.png"
              alt="Hairdrama Tasks — Plan, Organize, Grow Together"
              width={3000}
              height={823}
              priority
              className="h-auto w-[165px] transition-transform duration-200 group-hover:scale-[1.02] sm:w-[210px] lg:w-[235px]"
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/90 bg-white/85 p-1.5 shadow-[0_8px_30px_-18px_rgba(32,40,33,.35)] backdrop-blur-xl lg:flex"
          >
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={getNavHref(item.href, item.label)}
                aria-current={
                  isLanding && index === 0 ? "page" : undefined
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
                  isLanding && index === 0
                    ? "bg-[#E8EDE4] text-[#244A3D] shadow-sm"
                    : "text-[#687166] hover:bg-[#F4F3EE] hover:text-[#244A3D]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right-side action */}
          <Link
            href={isLanding ? "/login" : "/"}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#244A3D] bg-[#244A3D] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#19382E] sm:px-5 sm:text-sm"
          >
            {isLanding ? "Login" : "Home"}

            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Mobile navigation */}
        <nav
          aria-label="Mobile navigation"
          className="flex gap-2 overflow-x-auto pb-2.5 lg:hidden"
        >
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={getNavHref(item.href, item.label)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                isLanding && index === 0
                  ? "border-[#D5DFD0] bg-[#E8EDE4] text-[#244A3D]"
                  : "border-[#E5E0D5] bg-white/80 text-[#5B665D] hover:bg-[#F0F0E8]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#B8C9B2]/70 to-transparent" />
    </header>
  );
}
