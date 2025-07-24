import Link from "next/link";
import React from "react";
import Image from "next/image";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { wixClient } from "@/lib/wixClient";
import DOMPurify from "isomorphic-dompurify";
import QuickAdd from "./QuickAdd";
import { getStockNumber, isInStock } from "@/utils/stock";
import StockDebug from "./StockDebug";

const PRODUCT_PER_PAGE = 20;

export default async function ProductList({
  categoryId,
  limit,
  searchParams,
  sortBy = "lastUpdated", // Add sortBy parameter with default
}: {
  categoryId?: string; // Make categoryId optional
  limit?: number; // Make limit optional
  searchParams?: any;
  sortBy?: "lastUpdated" | "name" | "price";
}) {
  const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  let query = wixClient.products.queryProducts();
  
  // Only filter by category if categoryId is provided and not empty
  if (categoryId && categoryId.trim() !== "") {
    query = query.eq("collectionIds", categoryId);
  }
  
  // Set limit (default to PRODUCT_PER_PAGE if not specified)
  const productLimit = limit && limit > 0 ? limit : PRODUCT_PER_PAGE;
  query = query.limit(productLimit);
  
  // Add sorting - for new products, sort by last updated date descending
  if (sortBy === "lastUpdated") {
    query = query.descending("lastUpdated");
  } else if (sortBy === "name") {
    query = query.ascending("name");
  } else if (sortBy === "price") {
    query = query.ascending("priceData.price");
  }
  
  const productList = await query.find();

  // Debug: Log the first product to see its structure
  if (productList.items.length > 0) {
    console.log('ProductList - First product data:', JSON.stringify(productList.items[0], null, 2));
    console.log('ProductList - Stock info:', productList.items[0].stock);
    const sanitizedStock = productList.items[0].stock && productList.items[0].stock.quantity === null
      ? { ...productList.items[0].stock, quantity: undefined }
      : productList.items[0].stock;
    console.log('ProductList - Stock number:', getStockNumber(sanitizedStock));
    console.log('ProductList - Is in stock:', isInStock(sanitizedStock));
  } else {
    console.log('ProductList - No products found');
  }

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {productList.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />

            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">${product.price?.price}</span>
          </div>
          {product.additionalInfoSections && (
            <div
              className="text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections?.find(
                    (section: any) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            ></div>
          )}
          <QuickAdd
            productId={product._id!}
            stockNumber={getStockNumber(product.stock && product.stock.quantity === null ? { ...product.stock, quantity: undefined } : product.stock)}
          />
        </Link>
      ))}
      {productList.items.length === 0 && (
        <div className="w-full text-center py-8">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}
    </div>
  );
}