"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";

export default function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read order number from localStorage
    const savedOrderNumber = localStorage.getItem("currentOrderNumber");
    setOrderNumber(savedOrderNumber || "");

    // Clear localStorage after reading
    localStorage.removeItem("currentOrderId");
    localStorage.removeItem("currentOrderNumber");
    localStorage.removeItem("currentOrderAmount");

    setIsLoading(false);
  }, []);
  return (
    <>
      <Navbar />

      <main className="bg-[#F8FAFC] min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto px-4 py-14 w-full text-center sm:px-6 md:py-20">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
              <CheckCircle className="w-20 h-20 text-blue-600 relative" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4 md:text-5xl">
            Order Confirmed!
          </h1>

          <p className="text-base leading-7 text-slate-600 mb-8 md:text-xl md:leading-normal">
            Thank you for your order. We&apos;ve received your payment and will start processing it right away.
          </p>

          {!isLoading && orderNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-center sm:p-8">
              <p className="text-sm text-slate-600 font-medium">Order Number</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{orderNumber}</p>
              <p className="text-sm text-green-600 font-semibold mt-3">Payment Status: Paid ✓</p>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 text-left sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              What&apos;s Next?
            </h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold mt-1">1</span>
                <span>You&apos;ll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold mt-1">2</span>
                <span>Our team will verify and prepare your order</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold mt-1">3</span>
                <span>We&apos;ll send you shipping details via WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold mt-1">4</span>
                <span>Your order will be delivered within 5-7 business days</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-200 flex items-center justify-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 h-14 border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-medium transition duration-200 flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-sm text-slate-500 mt-8">
            Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a> or chat with us on WhatsApp.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
