import Navbar from "@/components/navbar/navbar";
import Hero from "@/components/hero/hero";
import CategoriesSection from "@/components/categories/categories-section";
import FeaturedProducts from "@/components/products/featured-products";
import WhyChooseUs from "@/components/common/why-choose-us";
import Testimonials from "@/components/common/testimonials";
import CTASection from "@/components/common/cta-section";
import Footer from "@/components/common/footer";
import WhatsAppButton from "@/components/common/whatsapp-button";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      <Navbar />

      <Hero />

      <CategoriesSection />

      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
