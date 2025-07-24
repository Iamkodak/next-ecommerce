"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useCallback } from "react";
import Spinner from "./Spinner";
import Link from "next/link";

interface LineItem {
  _id: string;
  quantity: number;
  price?: {
    amount?: number;
  };
  productName?: string;
  catalogReference?: {
    catalogItemId?: string;
  };
  image?: {
    url?: string;
  };
}

interface Cart {
  lineItems: LineItem[];
  subtotal?: {
    amount?: number;
  };
}

export default function CartModal() {
  const {
    cart,
    cartVisible,
    setCartVisible,
    removeFromCart,
    updateQuantity,
    isLoading,
    getProductById,
  } = useCart();

  const [productDetails, setProductDetails] = useState<
    Record<
      string,
      {
        name: string;
        image?: string;
        stock?: {
          trackInventory: boolean;
          quantity?: number;
        };
      }
    >
  >({});
  const [loadingDetails, setLoadingDetails] = useState(true);

  const fetchProductDetails = useCallback(async () => {
    if (!cart?.lineItems || cart.lineItems.length === 0) return;

    setLoadingDetails(true);
    const details: Record<string, any> = {};

    for (const item of cart.lineItems) {
      if (!productDetails[item._id]) {
        try {
          const product = await getProductById(
            item.catalogReference?.catalogItemId || ""
          );
          if (product) {
            details[item._id] = {
              name: product.name,
              image: product.media?.mainMedia?.image?.url || item.image?.url,
              stock: product.stock,
            };
          }
        } catch (err) {
          console.error("Error fetching product details:", err);
        }
      }
    }

    setProductDetails((prev) => ({ ...prev, ...details }));
    setLoadingDetails(false);
  }, [cart, getProductById, productDetails]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleCloseModal = useCallback(() => {
    setCartVisible(false);
  }, [setCartVisible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartVisible && !(e.target as HTMLElement).closest("#cart-modal")) {
        handleCloseModal();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [cartVisible, handleCloseModal]);

  if (!cartVisible) return null;

  const cartItems = cart?.lineItems || [];
  const subtotal = cart?.subtotal?.amount || 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div
        id="cart-modal"
        className="relative w-full max-w-md bg-white h-full flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Your Cart ({cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"})
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading || loadingDetails ? (
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-gray-500">
                Add some items to get started!
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {cartItems.map((item) => {
                const details = productDetails[item._id];
                const inStock = details?.stock?.trackInventory
                  ? (details.stock?.quantity || 0) > 0
                  : true;

                return (
                  <div key={item._id} className="p-4">
                    <div className="flex gap-4">
                      {details?.image ? (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={details.image}
                            alt={details.name || "Product image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      )}

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            {details?.name || item.productName || "Product"}
                          </h3>
                          <p className="font-semibold">
                            ${item.price?.amount?.toFixed(2) || "0.00"}
                          </p>
                        </div>

                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={item.quantity === 1}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  (item.quantity || 0) + 1
                                )
                              }
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={!inStock}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>

                        {!inStock && (
                          <p className="text-red-500 text-xs mt-2">
                            This item is no longer available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between mb-2 font-medium">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Shipping and taxes calculated at checkout.
            </p>

            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={handleCloseModal}
                className="flex-1 text-center py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={handleCloseModal}
                className="flex-1 text-center py-3 rounded-md bg-black text-white hover:bg-gray-800 transition"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
