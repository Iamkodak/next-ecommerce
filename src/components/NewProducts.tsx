import Link from "next/link";
import React from "react";
import Image from "next/image";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import DOMPurify from "isomorphic-dompurify";
import QuickAdd from "./QuickAdd";
import { getStockNumber } from "@/utils/stock";
import StockDebug from "./StockDebug";

export default async function NewProducts({ limit = 4 }: { limit?: number }) {
  const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  // Fetch the newest products sorted by last updated date
  const productList = await wixClient.products
    .queryProducts()
    .descending("lastUpdated") // Sort by newest first
    .limit(limit)
    .find();

  // Debug: Log the first product to see its structure
  if (productList.items.length > 0) {
    console.log('NewProducts - First product data:', JSON.stringify(productList.items[0], null, 2));
    console.log('NewProducts - Stock info:', productList.items[0].stock);
  }

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {productList.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] group"
          key={product._id}
        >
          <div className="relative w-full h-80">
            {/* New Badge */}
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-md z-20">
              NEW
            </div>
            
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt={product.name || "Product"}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />

            {product.media?.items && product.media.items.length > 1 && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt={product.name || "Product"}
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-medium group-hover:text-indigo-600 transition-colors">
              {product.name}
            </span>
            <span className="font-semibold text-indigo-600">
              ${product.price?.price}
            </span>
          </div>
          
          {product.additionalInfoSections && (
            <div
              className="text-sm text-gray-500 line-clamp-2"
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
          <p className="text-gray-500">No new products available at the moment.</p>
        </div>
      )}
    </div>
  );
}