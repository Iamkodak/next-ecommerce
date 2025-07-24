"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddProps {
  productId: string;
  variantId?: string;
  stockNumber?: number;
}

export default function Add({ 
  productId, 
  variantId = "00000000-0000-0000-0000-000000000000", 
  stockNumber = 0 
}: AddProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading } = useCart();

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }

    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      // Add to cart using the cart context
      await addToCart(productId);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Choose A Quantity</h3>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:opacity-50"
              onClick={() => handleQuantity("d")}
              disabled={quantity <= 1}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:opacity-50"
              onClick={() => handleQuantity("i")}
              disabled={quantity >= stockNumber}
            >
              +
            </button>
          </div>
          {stockNumber > 0 && (
            <div className="text-xs">
              Only <span className="text-orange-400">{stockNumber} items</span>{" "}
              left! <br />
              {"Don't"} miss it
            </div>
          )}
        </div>
        <button
          className="w-36 rounded-3xl ring-1 text-sm ring-indigo-600 text-indigo-600 py-2 px-4 hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none transition-all duration-300"
          onClick={handleAddToCart}
          disabled={isLoading || stockNumber <= 0}
        >
          {isLoading ? "Adding..." : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}