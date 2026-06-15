export default function CheckoutPayment() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="font-bold text-base mb-6 text-slate-900">
        Payment
      </h2>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 text-sm">
          Razorpay — UPI · Cards · NetBanking · Wallets · COD
        </h3>

        <p className="text-slate-600 text-xs mt-2">
          You&apos;ll be redirected to a secure Razorpay window after placing the order.
        </p>
      </div>
    </div>
  );
}
