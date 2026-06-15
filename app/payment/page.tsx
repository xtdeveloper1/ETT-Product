"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";
import { supabase } from "@/lib/supabase";
import { clearCart } from "@/store/cart-store";
import {
  isRazorpayConfigured,
  createRazorpayOptions,
  initializeRazorpayPayment,
  handlePaymentSuccess,
  handlePaymentError,
  handleCODPayment,
} from "@/lib/razorpay";

const PAYMENT_METHODS = ["Razorpay", "COD"];

export default function PaymentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [razorpayConfigured, setRazorpayConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedOrderId = localStorage.getItem("currentOrderId");
    const savedOrderNumber = localStorage.getItem("currentOrderNumber");
    const savedAmount = localStorage.getItem("currentOrderAmount");

    if (!savedOrderId) {
      router.push("/checkout");
      return;
    }

    setOrderId(savedOrderId);
    setOrderNumber(savedOrderNumber || "");
    setAmount(Number(savedAmount || 0));

    // Check if Razorpay is configured
    const configured = isRazorpayConfigured();
    setRazorpayConfigured(configured);

    if (!configured) {
      setError("Razorpay is not configured. Please contact support.");
    }
  }, [router]);

  const handlePayNow = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    if (paymentMethod === "Razorpay" && !razorpayConfigured) {
      setError("Razorpay is not configured");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch order details to get customer info
      const { data: orderData, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (fetchError || !orderData) {
        setError("Failed to fetch order details");
        return;
      }

      // Handle COD payment
      if (paymentMethod === "COD") {
        try {
          await handleCODPayment({
            orderId: orderId,
            orderData: orderData,
          });

          // Clear cart from state
          clearCart();

          // Clear localStorage
          localStorage.removeItem("currentOrderId");
          localStorage.removeItem("currentOrderNumber");
          localStorage.removeItem("currentOrderAmount");

          // Redirect to success page
          router.push("/checkout/success");
        } catch (err) {
          console.error("Error handling COD payment:", err);
          setError("Failed to confirm COD order. Please try again.");
          setLoading(false);
        }
        return;
      }

      // Create Razorpay options
      const razorpayOptions = createRazorpayOptions({
        amount: amount,
        orderId: orderId,
        customerName: orderData.customer_name || "Customer",
        customerEmail: orderData.customer_email || "",
        customerPhone: orderData.customer_phone || "",
        onSuccess: async (response) => {
          try {
            // Handle successful payment
            // This will:
            // 1. Update orders table with payment_status = paid, order_status = confirmed
            // 2. Set payment_id to razorpay_payment_id
            // 3. Set payment_method to "Razorpay"
            await handlePaymentSuccess({
              orderId: orderId,
              paymentResponse: response,
              orderData: orderData,
            });

            // Clear cart from state
            clearCart();

            // Clear localStorage
            localStorage.removeItem("currentOrderId");
            localStorage.removeItem("currentOrderNumber");
            localStorage.removeItem("currentOrderAmount");

            // Redirect to success page
            router.push("/checkout/success");
          } catch (err) {
            console.error("Error handling payment success:", err);
            setError("Payment successful but order update failed. Please contact support.");
            setLoading(false);
          }
        },
        onError: async (err) => {
          try {
            // Handle payment failure
            // This keeps the order in pending state
            await handlePaymentError({
              orderId: orderId,
              error: err,
            });

            setError(
              "Payment failed. Please try again or contact support."
            );
            setLoading(false);
          } catch (handleErr) {
            console.error("Error handling payment error:", handleErr);
            setLoading(false);
          }
        },
      });

      // Initialize and open Razorpay checkout
      await initializeRazorpayPayment(razorpayOptions);
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      {/* Header */}
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Payment</h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Order Info */}
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-sm text-slate-600 font-medium">Order Number</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {orderNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600 font-medium">Total Amount</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">
                ₹{amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {paymentMethod === "Razorpay" ? (
                  <>
                    <p className="text-sm font-semibold text-blue-900">
                      Secure Payment via Razorpay
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Pay securely using UPI, Credit Card, Net Banking, or Wallet
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-blue-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Pay when you receive your order
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment Methods Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-900 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setPaymentMethod("Razorpay");
                  setError(null);
                }}
                className={`py-3 px-3 rounded-lg border-2 text-sm font-medium transition ${
                  paymentMethod === "Razorpay"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                💳 Razorpay
              </button>
              <button
                onClick={() => {
                  setPaymentMethod("COD");
                  setError(null);
                }}
                className={`py-3 px-3 rounded-lg border-2 text-sm font-medium transition ${
                  paymentMethod === "COD"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                📦 Cash on Delivery
              </button>
            </div>
          </div>

          {/* Payment Info Box - Razorpay */}
          {paymentMethod === "Razorpay" && (
            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-3">
                Payment Methods Supported:
              </h3>
              <ul className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  UPI (Google Pay, PhonePe, Paytm)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Credit/Debit Card
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Net Banking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Digital Wallets
                </li>
              </ul>
            </div>
          )}

          {/* COD Info Box */}
          {paymentMethod === "COD" && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">
                How Cash on Delivery Works:
              </h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">1.</span>
                  <span>Complete your purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">2.</span>
                  <span>We'll prepare and ship your order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">3.</span>
                  <span>Pay the delivery agent when order arrives</span>
                </li>
              </ul>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayNow}
            disabled={loading || (paymentMethod === "Razorpay" && !razorpayConfigured)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold text-lg rounded-lg transition"
          >
            {loading ? "Processing..." : `${paymentMethod === "COD" ? "Confirm Order" : "Pay"} ₹${amount.toLocaleString()}`}
          </button>

          {paymentMethod === "Razorpay" && !razorpayConfigured && (
            <p className="text-sm text-center text-red-600 mt-4 font-medium">
              ⚠️ Razorpay is not configured. Payment feature is unavailable.
            </p>
          )}

          <p className="text-xs text-center text-slate-500 mt-4">
            {paymentMethod === "COD" ? "Payment required on delivery" : "Secure payment processing powered by Razorpay"}
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
