import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";

import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";
import ContactWhatsapp from "@/components/contact/contact-whatsapp";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#F8FAFC] min-h-screen">

        <div className="container-page py-16 md:py-20">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>
              <ContactInfo />
              <ContactWhatsapp />
            </div>

            <ContactForm />

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}