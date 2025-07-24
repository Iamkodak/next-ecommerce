// components/ProductCard.tsx
"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { isInStock } from "@/utils/stock";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: {
      formatted: {
        price: string;
      };
      amount: number;
    };
    media?: {
      mainMedia?: {
        image?: {
          url?: string;
        };
      };
    };
    stock?: {
      trackInventory?: boolean;
      quantity?: number;
    };
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Check if product is in stock using utility function
  const inStock = isInStock(product.stock);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product._id);
      // Success animation or notification could go here
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative aspect-square bg-gray-50">
        {product.media?.mainMedia?.image?.url ? (
          <Image
            src={product.media.mainMedia.image.url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Stock status badge */}
        {!inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of stock
          </div>
        )}

        {/* Quick add button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !inStock || isLoading}
          className={`absolute bottom-0 left-0 right-0 w-full py-3 bg-black text-white transition-all duration-300 ${
            isAdding || !inStock || isLoading
              ? "opacity-70 cursor-not-allowed"
              : "opacity-0 group-hover:opacity-100 hover:bg-gray-900"
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </span>
          ) : inStock ? (
            "Add to Cart"
          ) : (
            "Unavailable"
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
          {product.name}
        </h3>

        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-indigo-600">
            {product.price?.formatted?.price || "$0.00"}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || !inStock || isLoading}
            className={`p-2 rounded-full ${
              isAdding || !inStock || isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Add to cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;