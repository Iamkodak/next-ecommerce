"use client";

import React, { useState } from "react";

interface AddProps {
  productId: string;
  initialStock?: number;
}

export default function Add({ productId, initialStock = 4 }: AddProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }

    if (type === "i" && quantity < initialStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Add your cart logic here using productId and quantity
      console.log(`Adding ${quantity} of product ${productId} to cart`);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`${quantity} item(s) added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
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
              disabled={quantity >= initialStock}
            >
              +
            </button>
          </div>
          {initialStock > 0 && (
            <div className="text-xs">
              Only <span className="text-orange-400">{initialStock} items</span>{" "}
              left! <br />
              {"Don't"} miss it
            </div>
          )}
        </div>
        <button
          className="w-36 rounded-3xl ring-1 text-sm ring-rogue text-rogue py-2 px-4 hover:bg-rogue hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
          onClick={handleAddToCart}
          disabled={isAdding || initialStock <= 0}
        >
          {isAdding ? "Adding..." : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}
