
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  ListChecks,
  Users,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "One clear workspace",
    description:
      "Keep task details, priorities, deadlines and progress together in a workspace designed to stay easy to scan.",
    icon: ListChecks,
    iconStyle: "bg-[#E2EADD] text-[#31553D]",
    tint: "bg-[#F9FAF6]",
  },
  {
    number: "02",
    title: "Ownership without confusion",
    description:
      "Assign work to registered teammates so every task has a clear owner and responsibilities are easy to understand.",
    icon: Users,
    iconStyle: "bg-[#EFE2D5] text-[#8A4528]",
    tint: "bg-[#FCF9F4]",
  },
  {
    number: "03",
    title: "Updates that reach people",
    description:
      "Keep task creators and assignees informed through notifications when work is created or completed.",
    icon: BellRing,
    iconStyle: "bg-[#DDE7E9] text-[#4C6D78]",
    tint: "bg-[#F6F9F9]",
  },
];

const steps = [
  {
    number: "01",
    title: "Create",
    description:
      "Describe the task, set its priority, and add a deadline when needed.",
    detail: "Start with clarity",
    color: "bg-[#E2EADD] text-[#31553D]",
  },
  {
    number: "02",
    title: "Assign",
    description:
      "Choose a registered teammate so responsibility is clear from the start.",
    detail: "Give work an owner",
    color: "bg-[#EFE2D5] text-[#8A4528]",
  },
  {
    number: "03",
    title: "Complete",
    description:
      "Update progress, mark the task complete, and keep everyone informed.",
    detail: "Make progress visible",
    color: "bg-[#DDE7E9] text-[#4C6D78]",
  },
];

export default function FeaturesSection() {
  return (
    <>
      <section
        id="features"
        className="section-atmosphere scroll-mt-24 border-y border-[#E5E0D5] bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center landing-rise">
            <p className="text-xs font-bold tracking-[.19em] text-[#53735A]">
              A BETTER WAY TO WORK
            </p>

            <h2 className="mt-5 font-heading text-3xl font-semibold leading-[1.13] tracking-[-.05em] sm:text-4xl lg:text-[52px]">
              Less chasing.
              <span className="font-accent ml-2 font-normal italic text-[#8A4528]">
                More progress.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5B665D] sm:text-base sm:leading-8">
              Bring task ownership, deadlines and progress into one
              thoughtfully organized workspace. Spend less time
              coordinating and more time moving work forward.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className={`landing-feature-card rounded-[22px] border border-[#E5E0D5] p-6 sm:p-7 ${feature.tint}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconStyle}`}>
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <span className="font-heading text-sm font-semibold tracking-[.12em] text-[#A7A495]">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-7 font-heading text-xl font-semibold tracking-tight text-[#202821]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#5B665D]">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-px bg-[#E5E0D5]" />

                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#244A3D]">
                    <CheckCircle2 size={15} />
                    Designed for clarity
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-5 sm:px-8 lg:grid-cols-[.84fr_1.16fr] lg:gap-20 lg:px-10">
          <div className="landing-rise">
            <p className="text-xs font-bold tracking-[.19em] text-[#53735A]">
              THE WORKFLOW
            </p>

            <h2 className="mt-5 font-heading text-3xl font-semibold leading-[1.13] tracking-[-.05em] sm:text-4xl lg:text-[48px]">
              A clear path from
              <span className="font-accent ml-2 font-normal italic text-[#8A4528]">
                start to done.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#5B665D] sm:text-base sm:leading-8">
              Keep the process straightforward: define the work,
              decide who owns it, and track its completion.
            </p>

            <Link
              href="/login"
              className="landing-button mt-7 inline-flex items-center gap-2 rounded-full bg-[#244A3D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#19382E]"
            >
              Start managing tasks <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="landing-workflow-card flex gap-4 rounded-[20px] border border-[#E5E0D5] bg-white p-5 sm:gap-5 sm:p-6"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-heading text-sm font-bold ${step.color}`}>
                  {step.number}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-heading text-base font-semibold">
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#777D70]">
                      {step.detail}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#5B665D]">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          id="about"
          className="mx-auto mt-20 max-w-[1280px] scroll-mt-24 px-5 sm:px-8 lg:px-10"
        >
          <div className="landing-cta relative isolate overflow-hidden rounded-[28px] bg-[#20382B] px-6 py-11 text-white sm:px-10 sm:py-14 lg:px-14">
            <div className="landing-cta-glow pointer-events-none absolute -right-20 -top-36 -z-10 h-96 w-96 rounded-full bg-[#B7C8A6]/20 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-bold tracking-[.18em] text-[#D8C8A6]">
                  YOUR WORKSPACE, SIMPLIFIED
                </p>

                <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl lg:text-[46px]">
                  Make the next step
                  <br className="hidden sm:block" /> the clearest one.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#E0E8DE] sm:text-base">
                  Organize responsibilities, bring progress into view,
                  and keep your team moving forward together.
                </p>
              </div>

              <Link
                href="/login"
                className="landing-button group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F8F7F2] px-6 py-3.5 text-sm font-semibold text-[#244A3D] hover:bg-[#E9E5D9]"
              >
                Get started
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
