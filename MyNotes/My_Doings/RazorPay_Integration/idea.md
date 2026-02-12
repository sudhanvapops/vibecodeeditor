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