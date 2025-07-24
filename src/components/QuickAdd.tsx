"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface QuickAddProps {
  productId: string;
  stockNumber?: number;
}

export default function QuickAdd({ 
  productId, 
  stockNumber = 0 
}: QuickAddProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(productId);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      className="rounded-2xl ring-1 ring-indigo-600 text-indigo-600 w-max py-2 px-4 text-xs hover:bg-indigo-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleAddToCart}
      disabled={isAdding || stockNumber <= 0}
    >
      {isAdding ? "Adding..." : stockNumber <= 0 ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
