"use client";

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { createClient, OAuthStrategy, TokenRole } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie";

export type WixClientType = ReturnType<typeof createClient> & {
  products: typeof products;
  collections: typeof collections;
  currentCart: typeof currentCart;
};

interface WixContextType {
  wixClient: WixClientType;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const WixClientContext = createContext<WixContextType | null>(null);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let refreshToken = {
    value: "",
    role: "user" as TokenRole
  };

  try {
    const token = Cookies.get("refreshToken");
    if (token) {
      const parsedToken = JSON.parse(token);
      refreshToken = {
        value: parsedToken.value || "",
        role: (parsedToken.role === "admin" ? "admin" : "user") as TokenRole
      };
      setIsAuthenticated(!!parsedToken.value);
    }
  } catch (error) {
    console.error("Error parsing refreshToken:", error);
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
      currentCart,
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken,
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <WixClientContext.Provider value={{ wixClient, isAuthenticated, isLoading }}>
      {children}
    </WixClientContext.Provider>
  );
};

export const useWixClient = () => {
  const context = useContext(WixClientContext);
  if (!context) {
    throw new Error("useWixClient must be used within WixClientContextProvider");
  }
  return context.wixClient;
};

export const useWixAuth = () => {
  const context = useContext(WixClientContext);
  if (!context) {
    throw new Error("useWixAuth must be used within WixClientContextProvider");
  }
  return {
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    wixClient: context.wixClient
  };
};