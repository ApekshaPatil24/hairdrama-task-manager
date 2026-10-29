
import Image from "next/image";
import GoogleSignInButton from "@/components/auth/google-sign-in-button";
import SiteHeader from "@/components/landing/site-header";
import SiteFooter from "@/components/landing/site-footer";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "Stay organized",
    description: "Keep tasks and priorities in one place.",
    icon: ClipboardCheck,
  },
  {
    number: "02",
    title: "Work together",
    description: "Make ownership clear across your team.",
    icon: UsersRound,
  },
  {
    number: "03",
    title: "Make progress",
    description: "Turn plans into completed work.",
    icon: Activity,
  },
];

const steps = [
  {
    number: "01",
    title: "Organize",
    description: "Bring your tasks together.",
    active: true,
  },
  {
    number: "02",
    title: "Assign",
    description: "Make responsibilities clear.",
    active: false,
  },
  {
    number: "03",
    title: "Complete",
    description: "Keep progress moving.",
    active: false,
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2]">
    <SiteHeader variant="inner" />

    <main className="login-page relative flex min-h-[calc(100svh-78px)] items-center justify-center overflow-hidden bg-[#19231D] px-3 py-5 sm:px-6 sm:py-8 lg:px-10">      {/* Ambient background effects */}
      <div
        aria-hidden="true"
        className="login-ambient login-ambient-one pointer-events-none absolute -left-40 -top-32 h-[480px] w-[480px] rounded-full"
      />
      <div
        aria-hidden="true"
        className="login-ambient login-ambient-two pointer-events-none absolute -bottom-48 -right-28 h-[560px] w-[560px] rounded-full"
      />

      {/* Main split-screen card */}
      <div className="login-shell relative z-10 grid w-full max-w-[1260px] overflow-hidden rounded-[26px] border border-white/10 bg-white p-2 shadow-[0_35px_110px_-35px_rgba(0,0,0,.55)] sm:rounded-[32px] lg:grid-cols-[1.16fr_.84fr]">
        {/* LEFT PANEL */}
        <section
          className="login-brand-panel relative isolate flex min-h-[610px] flex-col overflow-hidden rounded-[20px] px-5 py-6 text-white sm:min-h-[650px] sm:px-9 sm:py-9 lg:min-h-[700px] lg:px-11 lg:py-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 12% 12%, rgba(168,192,164,.24), transparent 30%),
              radial-gradient(circle at 88% 86%, rgba(164,93,66,.24), transparent 32%),
              linear-gradient(135deg, #315A48 0%, #244A3D 52%, #19382E 100%)
            `,
          }}
        >
          {/* Fine grid and abstract geometry */}
          <div
            aria-hidden="true"
            className="login-grid pointer-events-none absolute inset-0 -z-10"
          />

          <div
            aria-hidden="true"
            className="login-orbit login-orbit-one pointer-events-none absolute -right-24 -top-28 -z-10 h-[330px] w-[330px] rounded-full border border-white/[0.12]"
          />

          <div
            aria-hidden="true"
            className="login-orbit login-orbit-two pointer-events-none absolute -right-10 -top-14 -z-10 h-[230px] w-[230px] rounded-full border border-[#D8C8A6]/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-28 left-1/2 -z-10 h-48 w-48 rounded-full bg-[#A8C0A4]/10 blur-3xl"
          />

          {/* Brand */}
          <div className="login-reveal flex items-center justify-between gap-4">
            <div className="inline-flex max-w-full items-center rounded-xl  p-2 shadow-lg shadow-black/10">
            </div>

            <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[10px] font-medium text-[#E1E8DC] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8C8A6]" />
              TASK MANAGEMENT
            </span>
          </div>

          {/* Main introduction */}
          <div className="login-reveal login-reveal-delay-1 flex flex-1 flex-col justify-center py-12 sm:py-14 lg:py-16">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-2 text-xs font-medium text-[#E5EBDD] backdrop-blur-sm">
              <CheckCircle2 size={14} className="text-[#D8C8A6]" />
              A workspace built for clarity
            </div>

            <h1 className="max-w-[560px] font-heading text-[43px] font-semibold leading-[1.08] tracking-[-0.055em] sm:text-[56px] lg:text-[60px] xl:text-[66px]">
              Start your
              <br />
              <span className="font-accent font-normal italic text-[#E3C9A0]">
                journey.
              </span>
            </h1>

            <p className="mt-6 max-w-[440px] text-sm leading-7 text-[#E0E8DE] sm:text-base sm:leading-8">
              Bring tasks, responsibilities and progress into one
              organized workspace. Make the next step clearer for
              you and your team.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Clear ownership", "Visible progress"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/[0.08] px-3 py-2 text-[11px] font-medium text-[#E5EBDD]"
                >
                  <CheckCircle2 size={13} className="text-[#D8C8A6]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Three numbered cards inspired by your reference */}
          <div className="login-reveal login-reveal-delay-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`login-step-card min-w-0 rounded-2xl p-3.5 transition duration-300 sm:min-h-[122px] sm:p-4 ${
                  step.active
                    ? "bg-[#F8F7F2] text-[#244A3D] shadow-lg shadow-black/[0.08]"
                    : "border border-white/15 bg-white/[0.08] text-white backdrop-blur-sm"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                    step.active
                      ? "bg-[#244A3D] text-white"
                      : "border border-white/25 text-[#F8F7F2]"
                  }`}
                >
                  {step.number}
                </span>

                <p className="mt-4 text-xs font-semibold sm:mt-5 sm:text-sm">
                  {step.title}
                </p>

                <p
                  className={`mt-1.5 text-[10px] leading-4 ${
                    step.active ? "text-[#5B665D]" : "text-[#D5E0D1]"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[10px] tracking-wide text-[#CFDCCB]">
            PLAN <span className="mx-1.5 text-[#D8C8A6]">·</span>
            ORGANIZE <span className="mx-1.5 text-[#D8C8A6]">·</span>
            GROW TOGETHER
          </p>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-w-0 items-center justify-center bg-white px-5 py-12 sm:px-10 sm:py-14 lg:px-9 xl:px-14">
          <div className="login-reveal login-reveal-delay-1 w-full max-w-[370px]">
            {/* Small sign-in indicator */}
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E4D8] bg-[#F8F7F2] px-3.5 py-2 text-[11px] font-semibold text-[#47634E]">
                <ShieldCheck size={15} />
                SECURE ACCOUNT ACCESS
              </span>
            </div>

            <div className="text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.045em] text-[#202821] sm:text-[36px]">
                Welcome{" "}
                <span className="font-accent font-normal italic text-[#A45D42]">
                  Back.
                </span>
              </h2>

              <p className="mx-auto mt-3 max-w-[310px] text-sm leading-6 text-[#687166]">
                Sign in to continue to your Hairdrama Tasks workspace.
              </p>
            </div>

            {/* Existing OAuth button — functionality preserved */}
            <div className="mt-9">
              <GoogleSignInButton />
            </div>

            {/* Security note */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#E5E8DF] bg-[#F5F6F0] p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#31553D] shadow-sm">
                <ShieldCheck size={18} />
              </span>

              <div>
                <p className="text-xs font-semibold text-[#293C30]">
                  Secure & private
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#687166]">
                  Authenticate with Google. We never ask you to
                  enter your Google password here.
                </p>
              </div>
            </div>

            {/* Existing and new users */}
            <div className="mt-7 text-center">
              <p className="text-xs leading-6 text-[#687166]">
                New to Hairdrama Tasks?
              </p>

              <p className="mx-auto mt-1 max-w-[300px] text-xs leading-5 text-[#687166]">
                Your account is created automatically the first
                time you sign in with Google.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#E9E6DE]" />
              <span className="text-[10px] font-medium uppercase tracking-[.13em] text-[#8A9084]">
                Your workspace awaits
              </span>
              <span className="h-px flex-1 bg-[#E9E6DE]" />
            </div>

            <p className="mt-5 text-center text-[10px] leading-5 text-[#83897E]">
              By continuing, you agree to use Hairdrama Tasks
              responsibly and securely.
            </p>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-[#687166]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#739273]" />
              <span>Plan better. Work together. Move forward.</span>
              <ArrowUpRight size={12} className="text-[#A45D42]" />
            </div>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter variant="inner" />
  </div>
  );
}
