# Razorpay Payment Integration Setup Guide

## Overview

This guide explains how to set up and use the payment integration in the SuryaKart e-commerce application. The system supports both **Razorpay** and **Cash on Delivery (COD)** payment options.

## Current Implementation

The payment system is **production-ready** and offers two payment methods:

### 1. **Razorpay** (Online Payment)
All payment methods are handled by Razorpay's checkout:
- UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)
- Credit/Debit Cards
- Net Banking
- Digital Wallets (Paytm, Amazon Pay, Mobikwik, Freecharge)

### 2. **Cash on Delivery (COD)**
- No online payment required
- Payment collected when order arrives
- Order confirmed immediately after COD selection
- Perfect for customers who prefer to pay later

## Setup Steps

### 1. Get Your Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or log in to your account
3. Navigate to **Settings → API Keys**
4. Copy your **Key ID** (public key)

### 2. Add Environment Variable

Update `.env.local`:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_actual_key_id_here
```

Replace `your_actual_key_id_here` with your Razorpay Key ID.

**Important:** The `NEXT_PUBLIC_` prefix makes it a client-side variable, which is required for Razorpay.

### 3. Payment Flow

Once configured, the payment flow works as follows:

```
User at Cart
    ↓
Checkout Page
    ↓
Payment Page → Choose Payment Method
    ├─ Razorpay (requires config)
    └─ COD (always available)
    ↓
If Razorpay:
  └─ Razorpay Checkout Opens
     └─ User selects payment method & pays
     └─ On Success: Order marked "paid"
If COD:
  └─ Confirm Order button
     └─ On Success: Order marked "confirmed" (payment_status: pending)
    ↓
Success Page
↓
Email Confirmation Sent
↓
Cart Cleared
```

## File Structure

### Key Files

- **[lib/razorpay.ts](../lib/razorpay.ts)** - Core payment utilities
  - `loadRazorpayScript()` - Loads Razorpay script from CDN
  - `createRazorpayOptions()` - Configures Razorpay payment options
  - `handlePaymentSuccess()` - Processes successful Razorpay payments
  - `handlePaymentError()` - Handles Razorpay payment failures
  - `handleCODPayment()` - Processes Cash on Delivery orders
  - `isRazorpayConfigured()` - Checks if Razorpay key is set
  - `initializeRazorpayPayment()` - Opens Razorpay checkout

- **[app/payment/page.tsx](../app/payment/page.tsx)** - Payment page
  - Reads order details from localStorage
  - Validates Razorpay configuration
  - Shows payment method selector (Razorpay / COD)
  - Handles both payment methods
  - Shows appropriate error messages

### Database Schema

No changes needed. The existing `orders` table handles both payment methods:

```sql
orders table:
├─ payment_status: "pending" | "paid"
│  ├─ "paid" → Online payment (Razorpay)
│  └─ "pending" → COD (payment due on delivery)
├─ order_status: "pending" | "confirmed" | "shipped" | "delivered"
├─ payment_method: "Razorpay" | "COD"
└─ payment_id: "razorpay_payment_id_xxxxx" | null (for COD)
```

**Note:** Both Razorpay and COD orders have `order_status = "confirmed"` after successful payment/confirmation.

## Error Handling

### Razorpay Not Configured

If `NEXT_PUBLIC_RAZORPAY_KEY_ID` is missing:
- Error message: "Razorpay key not configured"
- Pay button is disabled
- Application does not crash
- User is informed to contact support

### Payment Failures

If payment fails:
- Order remains in "pending" state
- Error message displayed to user
- User can retry payment
- Order is not lost

### Email Failures

If confirmation email fails:
- Payment is still marked as successful
- Order status is updated
- Error is logged to console
- User can still proceed

## Testing

### Test Credentials

Razorpay provides test mode for development. Use these:

**Test UPI:**
- Any UPI ID like `success@razorpay` or `pending@razorpay` or `fail@razorpay`

**Test Cards:**
- **Success:** 4111 1111 1111 1111
- **Failure:** 4222 2222 2222 2222

### Test Flow

1. Go to payment page
2. Create an order (amount will be stored in localStorage)
3. Click "Pay" button
4. Razorpay checkout opens
5. Select payment method
6. Use test credentials
7. Complete payment
8. Check order status in database

## Production Deployment

### Before Going Live

1. ✅ Test all payment flows in Razorpay test mode
2. ✅ Add actual Razorpay Key ID to production environment
3. ✅ Verify email confirmation is sending
4. ✅ Test payment failure scenarios
5. ✅ Verify order status updates correctly
6. ✅ Set up monitoring for payment errors
7. ✅ Enable Razorpay webhooks (optional but recommended)

### Razorpay Setup

1. Switch from test mode to live mode in Razorpay Dashboard
2. Update `NEXT_PUBLIC_RAZORPAY_KEY_ID` with live key
3. Deploy to production

### Monitoring

Monitor these points:
- Payment success rate
- Failed payment recovery
- Email delivery status
- Order creation vs payment completion
- Razorpay webhook events

## Razorpay Webhooks (Optional)

For enhanced security, set up webhooks:

1. Go to [Razorpay Dashboard → Webhooks](https://dashboard.razorpay.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhook/razorpay`
3. Subscribe to events:
   - `payment.authorized`
   - `payment.failed`
   - `payment.captured`

Example implementation location: `app/api/webhook/razorpay.ts`

## Security Considerations

✅ **Already Handled:**
- Key ID is client-side (public) - designed for Razorpay
- No secret key exposed
- Payment processing via Razorpay servers
- HTTPS required in production
- Order validation before payment

⚠️ **Additional Measures (Recommended):**
- Implement webhook verification
- Add rate limiting on payment endpoint
- Monitor for suspicious activities
- Use CSP headers for script loading
- Regularly update Razorpay library

## Troubleshooting

### "Razorpay key not configured"

**Solution:** Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` to `.env.local` and restart dev server

### Checkout doesn't open

**Solution:** Check browser console for errors. Likely causes:
- Script loading failed (check network tab)
- Invalid key ID format
- CSP policy blocking script

### Payment successful but order not updated

**Solution:** Check database directly:
```sql
SELECT * FROM orders WHERE id = 'order_id' ORDER BY created_at DESC LIMIT 1;
```

If payment_id is empty, payment callback didn't execute. Check for JavaScript errors in console.

### Email not sending

**Solution:** Verify Resend API key is configured. Check:
- `RESEND_API_KEY` in `.env.local`
- `app/api/send-order-email` endpoint is working
- Customer email is valid

## Support & Documentation

- **Razorpay Docs:** https://razorpay.com/docs
- **Razorpay Support:** https://support.razorpay.com
- **Test Credentials:** https://razorpay.com/docs/development/testing

## Implementation Notes

- **No Backend Setup Needed:** Razorpay handles all payment processing
- **Client-Side Only:** All initialization happens in browser
- **Production Ready:** Once key is added, payments work immediately
- **No Code Changes Needed:** Just add the environment variable

## Rollback Plan

If you need to disable payments:

1. Remove or blank out `NEXT_PUBLIC_RAZORPAY_KEY_ID`
2. Deploy
3. Error message will show: "Razorpay key not configured"
4. Users informed, no crash

## Frequently Asked Questions

**Q: Do I need a Razorpay server key?**
A: No, not for basic payment processing. Server key is needed only for webhooks/verification.

**Q: Is the checkout PCI-DSS compliant?**
A: Yes, Razorpay checkout is fully PCI-DSS compliant.

**Q: Can I customize the checkout appearance?**
A: Yes, modify the `theme` property in `createRazorpayOptions()` in `lib/razorpay.ts`

**Q: What happens if internet connection drops during payment?**
A: Razorpay handles it. Payment status can be checked later via dashboard.

**Q: Can customers save cards for future payments?**
A: Yes, this is built into Razorpay checkout by default.

**Q: Can I disable COD for certain products?**
A: Yes, add logic in `checkout` or `payment` page to hide COD button for specific items. Example:
```typescript
const isCODAvailable = !cart.items.some(item => item.requiresPrepaid);
```

**Q: How do I track which orders are COD vs Razorpay?**
A: Query by `payment_method`:
```sql
SELECT * FROM orders WHERE payment_method = 'COD' AND payment_status = 'pending';
```

**Q: Can I set COD charge/fee?**
A: Yes, add COD fee logic during checkout:
```typescript
const codFee = paymentMethod === "COD" ? 50 : 0;
const totalAmount = subtotal + shipping + codFee;
```

---

**Last Updated:** June 15, 2026
**Status:** Production Ready ✅
**Payment Methods:** Razorpay + COD
