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
        <FeaturesSection />
        <DemoRoastPreview />
        <Testimonials />
        <AnalyticsSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
