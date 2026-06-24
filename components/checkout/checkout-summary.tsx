"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/store/cart-store";
import { supabase } from "@/lib/supabase";

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

interface CheckoutSummaryProps {
  checkoutData: CheckoutFormState;
}

export default function CheckoutSummary({ checkoutData }: CheckoutSummaryProps) {
  const router = useRouter();
  const { items, isLoaded, totals } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    // Validate checkout form
    if (
      !checkoutData.email ||
      !checkoutData.phone ||
      !checkoutData.firstName ||
      !checkoutData.lastName ||
      !checkoutData.address ||
      !checkoutData.city ||
      !checkoutData.state ||
      !checkoutData.pincode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate cart is not empty
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setIsProcessing(true);

      // Generate unique order number
      const orderNumber = `ETT-${Date.now()}`;

      // Insert order into orders table
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: `${checkoutData.firstName} ${checkoutData.lastName}`,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: checkoutData.address,
            city: checkoutData.city,
            state: checkoutData.state,
            pincode: checkoutData.pincode,
            total_amount: totals.total,
            order_number: orderNumber,
            payment_status: "pending",
            order_status: "pending",
          },
        ])
        .select();

      if (orderError) {
        console.error("Order insertion error:", orderError);
        alert("Failed to create order");
        return;
      }

      const orderId = orderData?.[0]?.id;
      if (!orderId) {
        alert("Failed to get order ID");
        return;
      }

      // Save all cart products into order_items table
      const orderItems = items
        .filter((item) => item.product_id) // Only include items with numeric product_id
        .map((item) => ({
          order_id: orderId,
          product_id: item.product_id,
          product_name: item.name,
          product_image: item.image_url,
          quantity: item.quantity,
          price: item.price,
        }));

      console.log("Order Items Payload:", JSON.stringify(orderItems, null, 2));

      if (orderItems.length === 0) {
        console.error(
          "No valid order items. Items in cart:",
          items.map((item) => ({
            slug: item.id,
            product_id: item.product_id,
            name: item.name,
          }))
        );
        alert("Error: No valid products in cart. Please re-add items and try again.");
        return;
      }

      console.log(orderItems);

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items insertion error:", {
          error: itemsError,
          items: orderItems,
          message: itemsError.message,
          details: itemsError.details,
        });
        alert(`Failed to save order items: ${itemsError.message}`);
        return;
      }

      // Store order details in localStorage for payment page
      localStorage.setItem("currentOrderId", orderId);
      localStorage.setItem("currentOrderNumber", orderNumber);
      localStorage.setItem("currentOrderAmount", totals.total.toString());

      // Send order confirmation email (non-blocking)
      try {
        console.log("Sending order confirmation email...");
        const emailResponse = await fetch("/api/send-order-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: `${checkoutData.firstName} ${checkoutData.lastName}`,
            customerEmail: checkoutData.email,
            orderNumber: orderNumber,
            amount: totals.total,
          }),
        });

        const emailData = await emailResponse.json();
        console.log("Email API Response:", emailData);

        if (!emailResponse.ok) {
          console.error("Email sending failed:", emailData);
        } else {
          console.log("Order confirmation email sent successfully");
        }
      } catch (emailError) {
        console.error("Error sending order confirmation email:", emailError);
        // Continue with checkout even if email fails
      }

      // Redirect to payment page
      router.push("/payment");
    } catch (error) {
      console.error("Order creation error:", error);
      alert("An error occurred while creating your order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
        <h2 className="font-bold text-base mb-6 text-slate-900">
          Order summary
        </h2>
        <p className="text-sm text-slate-500">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
        <h2 className="font-bold text-base mb-6 text-slate-900">
          Order summary
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Your cart is empty.
        </p>
        <Link href="/shop" className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center transition text-sm">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">

      <h2 className="font-bold text-base mb-6 text-slate-900">
        Order summary
      </h2>

      <div className="space-y-3 mb-6">

        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <Image
              src={item.image_url || "/images/placeholder.jpg"}
              alt={item.name}
              width={48}
              height={48}
              className="rounded-lg flex-shrink-0"
              unoptimized={
                item.image_url.startsWith("http") || item.image_url.includes("supabase")
              }
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">Qty {item.quantity}</p>
            </div>

            <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}

      </div>

      <div className="border-t border-slate-200 pt-6">

        <div className="flex justify-between mb-2 text-sm">
          <span className="text-slate-600 font-medium">Subtotal</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(totals.subtotal)}
          </span>
        </div>

        <div className="flex justify-between mb-4 text-sm">
          <span className="text-slate-600 font-medium">Shipping</span>
          <span className="font-semibold text-slate-900">Free</span>
        </div>

        <div className="flex justify-between pb-6 border-b border-slate-200">
          <span className="font-bold text-slate-900 text-base">Total</span>
          <span className="font-bold text-slate-900 text-base">
            {formatCurrency(totals.total)}
          </span>
        </div>

      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full mt-6 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition text-sm"
      >
        <Lock className="w-4 h-4" />
        {isProcessing ? "Processing..." : `Pay ${formatCurrency(totals.total)}`}
      </button>

      <p className="text-xs text-center text-slate-500 mt-4">
        By placing your order you agree to our terms.
      </p>

    </div>
  );
}
