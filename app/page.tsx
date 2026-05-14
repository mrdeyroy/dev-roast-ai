import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DemoRoastPreview from "@/components/DemoRoastPreview";
import Testimonials from "@/components/landing/Testimonials";
import AnalyticsSection from "@/components/landing/AnalyticsSection";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div className="gradient-separator" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }} />
        <FeaturesSection />
        <DemoRoastPreview />
        <div className="gradient-separator" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }} />
        <Testimonials />
        <AnalyticsSection />
        <div className="gradient-separator" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }} />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
