Frontend
   │
   │ handleRazorpayPayment()
   ▼
Backend
/api/payment/create-order
   │
   ▼
Returns order_id
   │
   ▼
Frontend openRazorpay()
   │
   ▼
Razorpay popup
   │
   ├── Success → handler()
   │             ▼
   │         Backend verify-payment
   │             ▼
   │         Success
   │
   └── Cancel → ondismiss()
                ▼
           Backend order-cancelled
