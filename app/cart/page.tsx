import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";
import MobileStoreHeader from "@/components/common/mobile-store-header";
import WhatsAppButton from "@/components/common/whatsapp-button";

import CartList from "@/components/cart/cart-list";
import CartSummary from "@/components/cart/cart-summary";

export default function CartPage() {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <MobileStoreHeader />

      <main className="min-h-screen bg-[#F6F8FC]">
        <section className="mx-auto max-w-7xl px-[22px] pb-16 pt-10 sm:px-6 md:py-12">

          <div className="mb-10 md:mb-10">
            <h1 className="text-[31px] font-bold leading-[1.1] text-slate-900 md:text-3xl">
              Your cart
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-12 md:gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartList />
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>

          </div>

        </section>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <WhatsAppButton />
    </>
  );
}
