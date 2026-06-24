"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";
import WhatsAppButton from "@/components/common/whatsapp-button";
import ShopContent from "@/components/shop/shop-content";

function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#F6F8FC] md:bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#315FCC]"></div>
        <p className="text-slate-600">Loading shop...</p>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <Suspense fallback={<ShopLoading />}>
        <ShopContent />
      </Suspense>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
