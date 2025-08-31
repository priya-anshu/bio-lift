// src/pages/Checkout.jsx
import React from "react";
import  Card  from "../components/ui/Card";
import  CardContent  from "../components/ui/CardContent";
import Button  from "../components/ui/Button";
import { motion } from "framer-motion";

const Checkout = ({ cart = [] }) => {
  // fallback: if no cart is passed, show dummy items
  const safeCart =
    cart.length > 0
      ? cart
      : [
          { name: "Protein Powder", price: 1500, quantity: 1 },
          { name: "Shaker Bottle", price: 300, quantity: 1 },
        ];

  const total = safeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      className="p-6 flex justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg bg-day-card dark:bg-night-card">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Checkout
          </h1>

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            <ul className="space-y-2">
              {safeCart.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
              <li className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <select className="w-full border rounded-lg px-3 py-2 dark:bg-night-card dark:text-gray-200">
              <option>UPI</option>
              <option>Credit/Debit Card</option>
              <option>Net Banking</option>
              <option>Cash on Delivery</option>
            </select>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
            <textarea
              rows="3"
              className="w-full border rounded-lg px-3 py-2 dark:bg-night-card dark:text-gray-200"
              placeholder="Enter your delivery address..."
            />
          </div>

          {/* Place Order */}
          <Button className="w-full text-lg py-3 rounded-xl shadow-md">
            Confirm & Pay
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Checkout;
