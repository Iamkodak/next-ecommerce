"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useWixClient } from "./wixContext";

// Define types based on Wix SDK structure
interface LineItem {
  _id: string;
  productName?: string;
  price?: {
    amount?: number;
  };
  quantity: number;
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

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  cartVisible: boolean;
  setCartVisible: (visible: boolean) => void;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, newQuantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getProductById: (productId: string) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartVisible, setCartVisible] = useState(false);

  const wixClient = useWixClient();

  const cartCount = cart?.lineItems?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await (wixClient as any).currentCart.getCurrentCart();
      setCart(cartData);
      setError(null);
    } catch (err: any) {
      // Handle different error cases gracefully
      if (err?.details?.applicationError?.code === 428) {
        // User not authenticated - set empty cart
        setCart({ lineItems: [] });
        setError(null);
        console.log("User not authenticated, using empty cart");
      } else if (err?.details?.applicationError?.code === "OWNED_CART_NOT_FOUND") {
        // No cart exists yet - this is normal, set empty cart
        setCart({ lineItems: [] });
        setError(null);
        console.log("No cart found, starting with empty cart");
      } else {
        setError("Failed to load cart");
        console.error("Cart fetch error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createCartIfNeeded = async () => {
    try {
      // Try to create a new cart
      const newCart = await (wixClient as any).currentCart.createCart();
      return newCart;
    } catch (err) {
      console.error("Failed to create cart:", err);
      return null;
    }
  };

  const addToCart = async (productId: string) => {
    try {
      setIsLoading(true);
      
      // First, try to add to current cart
      try {
        await (wixClient as any).currentCart.addToCurrentCart({
          lineItems: [
            {
              catalogReference: {
                appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
                catalogItemId: productId,
              },
              quantity: 1,
            },
          ],
        });
      } catch (addError: any) {
        // If cart doesn't exist, create one first
        if (addError?.details?.applicationError?.code === "OWNED_CART_NOT_FOUND") {
          await createCartIfNeeded();
          // Try adding again after creating cart
          await (wixClient as any).currentCart.addToCurrentCart({
            lineItems: [
              {
                catalogReference: {
                  appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
                  catalogItemId: productId,
                },
                quantity: 1,
              },
            ],
          });
        } else {
          throw addError;
        }
      }
      
      await fetchCart();
      setCartVisible(true);
    } catch (err: any) {
      if (err?.details?.applicationError?.code === 428) {
        setError("Please log in to add items to cart");
      } else {
        setError("Failed to add item to cart");
      }
      console.error("Add to cart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineItemId: string) => {
    try {
      setIsLoading(true);
      await (wixClient as any).currentCart.removeLineItemsFromCurrentCart([lineItemId]);
      await fetchCart();
    } catch (err) {
      setError("Failed to remove item from cart");
      console.error("Remove from cart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(lineItemId);
      return;
    }

    try {
      setIsLoading(true);
      await (wixClient as any).currentCart.updateCurrentCartLineItemQuantity([
        { _id: lineItemId, quantity: newQuantity },
      ]);
      await fetchCart();
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Update quantity error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = async (productId: string) => {
    try {
      return await (wixClient as any).products.getProduct(productId);
    } catch (err) {
      console.error("Error fetching product:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        error,
        cartVisible,
        setCartVisible,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart: fetchCart,
        getProductById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};