import SiteHeader from "./site-header";
import HeroSection from "./hero-section";
import DashboardPreview from "./dashboard-preview";
import FeaturesSection from "./features-section";
import SiteFooter from "./site-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#202821]">
      <SiteHeader />
      <main>
        <HeroSection />
        <DashboardPreview />
        <FeaturesSection />
      </main>
      <SiteFooter />
    </div>
  );
}