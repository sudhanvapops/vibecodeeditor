### Fronted

User clicks "Pay"

Backend creates Razorpay Order
It returns:
    order_id: order_ABC123
    amount: 50000
    currency: INR

Frontend opens Razorpay Checkout
Payment success → Verify on backend
    Backend verifies signature.
    If valid → Payment success.


handler → Runs After Successful Payment


### Backend 

1. create-order        → creates Razorpay order + DB record
2. verify-payment      → verifies payment signature + updates DB
3. order-cancelled     → updates DB if user cancels



1. create-order        → creates Razorpay order + DB record

payment lifecycle now becomes:
PENDING → SUCCESS / FAILED / CANCELLED

Return : {
  id: "order_xxx",
  amount: 50000,
  currency: "INR"
}


2. verify-payment      → verifies payment signature + updates DB

verify-payment API (CRITICAL PART)
uses sha256 