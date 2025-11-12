"use client"

import { useState, ChangeEvent, MouseEvent } from "react"
import { CreditCard, HandHeart, Phone, ShoppingBag, Truck } from "lucide-react"

interface FormData {
    fullName: string
    email: string
    phone: string
    note: string
    amount: number
}

const Payment = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        phone: "",
        note: "",
        amount: 20,
    })

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleRazorpayPayment = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        alert("Redirecting to Razorpay payment gateway...")
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-black dark:text-white p-4 md:p-8 transition-colors duration-300">

            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold ">Contribute to Us</h1>
                        <HandHeart className="text-[#d81adb] w-10 h-10" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Complete Your Payment
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">

                    {/* Payment Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6 shadow-sm dark:shadow-lg transition-colors">
                            <div className="flex items-center mb-6">
                                <Truck className="w-6 h-6 mr-3 text-blue-500 dark:text-blue-400" />
                                <h2 className="text-xl font-semibold">Payment Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Amount Min: ₹20
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="₹200"
                                    />
                                </div>

                                {/* Note */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">
                                        Note
                                    </label>
                                    <input
                                        type="text"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Any Note"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* Payment Summary */}
                    <div className="lg:col-span-1">

                        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm dark:shadow-lg transition-colors">
                            <div className="flex items-center mb-6">
                                <ShoppingBag className="w-6 h-6 mr-3 text-green-500 dark:text-green-400" />
                                <h2 className="text-xl font-semibold">Payment Summary</h2>
                            </div>

                            <div className="max-h-64 space-y-4 mb-6">
                                {/* Order Details*/}
                                <div className="flex items-start space-x-3">
                                   
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm truncate">
                                            Contribution
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Qty: 1
                                        </p>
                                    </div>
                                    <span className="font-semibold text-sm flex-shrink-0">
                                        {formData.amount && `₹${formData.amount}`}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-2">

                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{formData.amount && `₹${formData.amount}`}</span>
                                </div>
                               
                                {/* <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-₹500</span>
                                </div> */}

                                <div className="border-t border-gray-300 dark:border-gray-700 pt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formData.amount && `₹${formData.amount}`}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleRazorpayPayment}
                                disabled={ !formData.fullName || !formData.email || !(formData.amount >= 20) || !formData.phone}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg mt-6 transition-colors duration-200 flex items-center justify-center space-x-2  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Pay with Razorpay</span>
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Secure payment powered by Razorpay
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Payment
