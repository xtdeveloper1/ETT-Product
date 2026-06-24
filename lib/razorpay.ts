/**
 * Razorpay Payment Integration Utilities
 * Production-ready helper functions for Razorpay integration
 */

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Load Razorpay script from CDN
 * @returns Promise that resolves when script is loaded
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay payment options
 * @param options - Configuration object with order and customer details
 * @returns Razorpay options object
 */
export const createRazorpayOptions = ({
  amount,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
}: {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: RazorpayPaymentResponse) => void;
  onError: (error: any) => void;
}): RazorpayOptions => {
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (!razorpayKeyId) {
    throw new Error("Razorpay key not configured");
  }

  return {
    key: razorpayKeyId,
    amount: Math.round(amount * 100), // Convert to paise
    currency: "INR",
    name: "SuryaKart",
    description: `Order #${orderId}`,
    order_id: orderId,
    prefill: {
      name: customerName || "",
      email: customerEmail || "",
      contact: customerPhone || "",
    },
    handler: onSuccess,
    modal: {
      ondismiss: () => onError(new Error("Payment cancelled by user")),
    },
    theme: {
      color: "#2563EB", // Blue color to match your theme
    },
  };
};

/**
 * Handle payment success
 * Updates order in database and redirects to success page
 */
export const handlePaymentSuccess = async ({
  orderId,
  paymentResponse,
  orderData,
}: {
  orderId: string;
  paymentResponse: RazorpayPaymentResponse;
  orderData: any;
}): Promise<boolean> => {
  try {
    // Import supabase dynamically to avoid circular dependencies
    const { supabase } = await import("@/lib/supabase");

    // Update order payment status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        order_status: "confirmed",
        payment_method: "Razorpay",
        payment_id: paymentResponse.razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      throw new Error("Failed to update order status");
    }

    // Send confirmation emails
    try {
      const emailResponse = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: orderData.customer_name || "Customer",
          customerEmail: orderData.customer_email || "",
          customerPhone: orderData.customer_phone || "",
          orderNumber: orderData.order_number || orderId,
          amount: orderData.total_amount || 0,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Email sending failed:", await emailResponse.json());
        // Don't fail payment if email fails, just log it
      }
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Don't interrupt payment flow if email fails
    }

    return true;
  } catch (error) {
    console.error("Payment success handler error:", error);
    throw error;
  }
};

/**
 * Handle payment failure
 * Logs error and keeps order as pending
 */
export const handlePaymentError = async ({
  orderId,
  error,
}: {
  orderId: string;
  error: any;
}): Promise<void> => {
  console.error("Payment failed for order:", orderId);
  console.error("Error details:", error);

  // Order remains in pending state in the database
  // No update needed - order was already created with pending status
  
  // Optional: Log error to monitoring service
  // await logErrorToMonitoring({ orderId, error });
};

/**
 * Handle Cash on Delivery (COD) payment
 * Updates order status and sends confirmation email
 */
export const handleCODPayment = async ({
  orderId,
  orderData,
}: {
  orderId: string;
  orderData: any;
}): Promise<boolean> => {
  try {
    // Import supabase dynamically to avoid circular dependencies
    const { supabase } = await import("@/lib/supabase");

    // Update order with COD status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "pending",
        order_status: "confirmed",
        payment_method: "COD",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order for COD:", updateError);
      throw new Error("Failed to update order status");
    }

    // Send confirmation emails
    try {
      const emailResponse = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: orderData.customer_name || "Customer",
          customerEmail: orderData.customer_email || "",
          customerPhone: orderData.customer_phone || "",
          orderNumber: orderData.order_number || orderId,
          amount: orderData.total_amount || 0,
          paymentMethod: "COD",
        }),
      });

      if (!emailResponse.ok) {
        console.error("Email sending failed:", await emailResponse.json());
        // Don't fail COD if email fails, just log it
      }
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Don't interrupt COD flow if email fails
    }

    return true;
  } catch (error) {
    console.error("COD handler error:", error);
    throw error;
  }
};

/**
 * Verify if Razorpay is configured
 * @returns true if key is available, false otherwise
 */
export const isRazorpayConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
};

/**
 * Initialize Razorpay payment
 * Complete flow: load script → create options → open checkout
 */
export const initializeRazorpayPayment = async (
  options: RazorpayOptions
): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    throw new Error("Failed to load Razorpay script");
  }

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};
