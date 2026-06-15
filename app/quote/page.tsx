import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";
import WhatsAppButton from "@/components/common/whatsapp-button";
import QuoteForm from "@/components/quote/quote-form";

export default function QuotePage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 md:py-16">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center md:mb-12">
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">
                QUOTE REQUEST
              </p>
              <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">
                Get Your Solar System Quote
              </h1>
              <p className="text-sm leading-6 text-slate-600 mt-4 md:text-lg md:leading-normal">
                Tell us about your needs and we&apos;ll provide a personalized quote within 24 hours.
              </p>
            </div>

            <QuoteForm />
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
