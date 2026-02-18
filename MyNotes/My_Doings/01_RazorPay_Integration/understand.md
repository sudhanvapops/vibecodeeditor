User clicks Pay
   ↓
handleRazorpayPayment()
   ↓
Backend creates order (/api/payment/create-order)
   ↓
openRazorpay() opens Razorpay popup
   ↓
User pays
   ↓
handler() executes on success
   ↓
Backend verifies payment (/api/payment/verify-payment)
   ↓
Send email + success message
