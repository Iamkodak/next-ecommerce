import React, { Suspense } from "react";
import Image from "next/image";
import Fliter from "@/components/Fliter";
import ProductList from "@/components/ProductList";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";

export default async function ListPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const wixClient = createClient({
    modules: { products, collections },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  // Default fallback ID with proper type
  let collectionId: string = "00000000-000000-000000-000000000001";
  
  try {
    // Get first available collection
    const collectionsList = await wixClient.collections.queryCollections()
      .limit(1)
      .find();
    
    // Determine which slug to use
    const collectionSlug = searchParams.cat || collectionsList.items[0]?.slug;
    
    if (collectionSlug) {
      const collectionResponse = await wixClient.collections.getCollectionBySlug(collectionSlug);
      const validId = collectionResponse.collection?._id;
      
      if (validId) {
        collectionId = validId;
      } else {
        console.warn(`Collection with slug ${collectionSlug} has no ID`);
      }
    }
  } catch (error) {
    console.error("Error fetching collection:", error);
  }


  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* Campaign */}
      <div className="hidden sm:flex bg-pink-50 px-4 h-64 justify-between">
        <div className="w-2/3 flex flex-col justify-center items-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab Up to 50% off on <br /> Selected product
          </h1>
          <button className="rounded-3xl bg-rogue text-white w-max text-sm py-3 px-5">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image 
            src="/woman.png" 
            alt="Special offer" 
            fill 
            className="object-contain" 
          />
        </div>
      </div>

      {/* Filter */}
      <Fliter />

      {/* Products */}
      <h2 className="mt-12 text-xl font-semibold">Shoes For You</h2>
      <Suspense fallback={"loading..."}>
        <ProductList
          categoryId={collectionId}
          searchParams={searchParams} 
          limit={99}
        />
      </Suspense>
    </div>
  );
}