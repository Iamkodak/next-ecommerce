// src/hooks/useWixClient.tsx
import { useContext } from "react";
import { WixClientContext } from "@/context/wixContext";
import { products } from "@wix/stores";

export const useWixClient = () => {
  const context = useContext(WixClientContext);

  if (!context) {
    throw new Error(
      "useWixClient must be used within WixClientContextProvider"
    );
  }

  const { wixClient } = context;

  return {
    ...wixClient,
    getProduct: async (slug: string): Promise<products.Product | undefined> => {
      return wixClient.products
        .queryProducts()
        .eq("slug", slug)
        .find()
        .then((result: { items: products.Product[] }) => result.items[0]);
    },
  };
};