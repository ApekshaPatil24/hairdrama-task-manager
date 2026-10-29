
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-surface relative isolate scroll-mt-24 overflow-hidden"
    >
      <div className="relative mx-auto max-w-[1100px] px-5 pb-28 pt-16 text-center sm:px-8 sm:pb-36 sm:pt-20 lg:px-10 lg:pb-40 lg:pt-24">
        <div className="landing-rise inline-flex items-center gap-2 rounded-full border border-[#DCE3D7] bg-white/75 px-4 py-2 text-[11px] font-bold tracking-[.14em] text-[#47634E] shadow-sm sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-[#65866B]" />
          A CALMER WAY TO WORK TOGETHER
        </div>

        
<h1 className="landing-rise landing-delay-1 mx-auto mt-8 max-w-[1100px] font-heading text-[37px] font-semibold leading-[1.12] tracking-[-0.055em] text-[#244A3D] sm:text-5xl md:text-6xl lg:text-[72px]">
  <span className="block">
    Bring clarity to every task.
  </span>

  <span className="mt-2 block text-[#59615B]">
    Move forward,{" "}
    <span className="hero-accent font-accent font-normal italic">
      together.
    </span>
  </span>
</h1>


        <p className="landing-rise landing-delay-2 mx-auto mt-6 max-w-[620px] text-sm leading-7 text-[#5B665D] sm:text-base sm:leading-8">
          Bring tasks, responsibilities and progress into one
          organized workspace. Help your team focus on the work
          that moves everything forward.
        </p>

        <div className="landing-rise landing-delay-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="landing-button group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#244A3D] px-6 text-sm font-semibold text-white shadow-[0_10px_26px_-15px_rgba(36,74,61,.65)] hover:bg-[#19382E]"
          >
            Get started
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <a
            href="#features"
            className="landing-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E1E0D6] bg-white/85 px-6 text-sm font-semibold text-[#34483A] shadow-sm hover:border-[#B8C9B8] hover:bg-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E6EDE4]">
              <ArrowRight size={13} className="text-[#244A3D]" />
            </span>
            Explore features
          </a>
        </div>

        <div className="landing-rise landing-delay-4 mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[#637064] sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#41694D]" />
            Google sign-in
          </span>

          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#41694D]" />
            Clear task ownership
          </span>
        </div>
      </div>
    </section>
  );
}
