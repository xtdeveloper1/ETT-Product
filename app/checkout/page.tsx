"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";

import CheckoutContact from "@/components/checkout/checkout-contact";
import CheckoutShipping from "@/components/checkout/checkout-shipping";
import CheckoutPayment from "@/components/checkout/checkout-payment";
import CheckoutSummary from "@/components/checkout/checkout-summary";

interface CheckoutFormState {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const [checkoutData, setCheckoutData] = useState<CheckoutFormState>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  return (
    <>
      <Navbar />

      <main className="bg-[#F8FAFC] min-h-screen">

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">

          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Checkout
          </h2>

          <p className="text-slate-500 text-sm mt-2 mb-8 md:mb-12">
            Secure payments powered by Razorpay.
          </p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            <div className="space-y-8 lg:col-span-8">
              <CheckoutContact checkoutData={checkoutData} setCheckoutData={setCheckoutData} />
              <CheckoutShipping checkoutData={checkoutData} setCheckoutData={setCheckoutData} />
              <CheckoutPayment />
            </div>

            <div className="lg:col-span-4">
              <CheckoutSummary checkoutData={checkoutData} />
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
