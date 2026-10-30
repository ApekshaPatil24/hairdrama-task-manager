
import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

type SiteFooterProps = {
  variant?: "landing" | "inner";
};

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About us", href: "#about" },
];

export default async function SiteFooter({
  variant = "landing",
}: SiteFooterProps) {
  await connection();

  const year = new Date().getFullYear();
  const isLanding = variant === "landing";

  function getFooterHref(href: string, label: string) {
    if (isLanding) return href;
    return label === "Home" ? "/" : `/${href}`;
  }

  /* Compact footer for the login page */
  if (!isLanding) {
    return (
      <footer className="shrink-0 border-t border-white/10 bg-[#19231D] text-[#D5E0D1]">
        <div className="mx-auto flex min-h-[58px] max-w-[1160px] flex-col items-center justify-between gap-2.5 px-5 py-3 sm:flex-row sm:px-8">
          <p className="text-center text-[10px] leading-5 sm:text-left sm:text-[11px]">
            © {year} Hairdrama Tasks. Built for clearer teamwork.
          </p>

          <div className="flex items-center gap-4 text-[10px] sm:text-[11px]">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C6D8BE]" />
              Secure Google sign-in
            </span>

            <Link
              href="/"
              className="font-semibold text-[#F8F7F2] transition-colors hover:text-[#D8C8A6]"
            >
              Home
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  /* Full SVG footer for the landing page */
  return (
    <footer className="landing-footer">
      <div className="landing-footer-content relative z-10 mx-auto max-w-[1400px] px-5 pb-5 pt-[118px] sm:px-8 sm:pb-7 sm:pt-[130px] lg:px-10">
        <div className="grid gap-10 border-b border-white/15 pb-9 md:grid-cols-[1.35fr_.7fr_1fr] md:gap-12 md:pb-10">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Hairdrama Tasks home"
              className="inline-flex w-fit items-center rounded-xl border border-white/20 bg-[#F8F7F2] p-2 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Image
                src="/images/brand/hairdrama-tasks-logo-transparent.png"
                alt="Hairdrama Tasks — Plan, Organize, Grow Together"
                width={3000}
                height={823}
                className="h-auto w-[220px] sm:w-[250px]"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#D5E0D1]">
              A clearer way to organize responsibilities, manage
              tasks, and keep your team moving forward together.
            </p>

            <p className="mt-4 font-accent text-lg italic text-[#D8C8A6]">
              Clarity, by design.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:-translate-x-12 md:pt-14">
            <h2 className="font-heading text-sm font-bold text-white">
              Explore
            </h2>

            <nav
              aria-label="Footer navigation"
              className="mt-5 flex flex-col items-start gap-3.5"
            >
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={getFooterHref(link.href, link.label)}
                  className="footer-link group inline-flex items-center gap-2 text-sm text-[#D5E0D1] transition-colors hover:text-white"
                >
                  <span>{link.label}</span>

                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </a>
              ))}
            </nav>
          </div>

          {/* Call to action */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[#D8C8A6]">
              <ShieldCheck size={18} />

              <span className="text-xs font-semibold tracking-wide">
                YOUR WORKSPACE AWAITS
              </span>
            </div>

            <h2 className="mt-4 font-heading text-xl font-semibold leading-snug text-white">
              Make your next step count.
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#D5E0D1]">
              Bring your work into one organized space.
            </p>

            <Link
              href="/login"
              className="footer-cta mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F8F7F2] px-4 py-3 text-sm font-semibold text-[#244A3D] transition hover:bg-[#E6EDE4]"
            >
              Sign in with Google
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#D5E0D1]">
            © {year} Hairdrama Tasks. Built for clearer teamwork.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#D5E0D1]">
            <span className="h-2 w-2 rounded-full bg-[#C6D8BE]" />
            <span>Tasks, ownership and progress in one place.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
