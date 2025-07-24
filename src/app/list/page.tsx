"use client";

import { WixClientContext } from "@/context/wixContext";
import { useContext, useEffect, useState } from "react";
import { products } from "@wix/stores";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define proper types based on Wix SDK
interface Product {
  _id: string;
  name: string;
  slug?: string;
  priceData?: {
    formatted?: {
      price?: string;
    };
    price?: number;
  };
  media?: {
    mainMedia?: {
      image?: {
        url?: string;
      };
    };
  };
}

interface Collection {
  _id: string;
  name?: string;
  slug?: string;
}

export default function ListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const context = useContext(WixClientContext);
  const wixClient = context?.wixClient;
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      if (!wixClient) return;

      try {
        setIsLoading(true);
        const result = await wixClient.collections.queryCollections().find();
        setCollections(result.items || []);
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [wixClient]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!wixClient) return;

      try {
        setIsLoading(true);
        let productQuery = wixClient.products.queryProducts();

        if (category) {
          productQuery = productQuery.eq("collectionIds", category);
        }

        if (sort === "asc") {
          productQuery = productQuery.ascending("priceData.price");
        } else if (sort === "desc") {
          productQuery = productQuery.descending("priceData.price");
        }

        const result = await productQuery.find();
        setProductList(result.items || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [wixClient, category, sort]);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <select
          className="p-2 border rounded-md"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="">All Categories</option>
          {collections.map((collection) => (
            <option key={collection._id} value={collection._id}>
              {collection.name || "Unnamed Collection"}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sort By</h2>
        <select
          className="p-2 border rounded-md"
          onChange={(e) => setSort(e.target.value)}
          value={sort}
        >
          <option value="">Recommended</option>
          <option value="asc">Price (Low to High)</option>
          <option value="desc">Price (High to Low)</option>
        </select>
      </div>

      {/* Product List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productList.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() =>
                router.push(`/product/${product.slug || product._id}`)
              }
            >
              <div className="aspect-square bg-gray-100 relative">
                {product.media?.mainMedia?.image?.url ? (
                  <Image
                    src={
                      product.media?.mainMedia?.image?.url || "/placeholder.jpg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-indigo-600 font-bold mt-1">
                  {product.priceData?.formatted?.price || "$0.00"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
