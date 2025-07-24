"use client";

import { useEffect, useState } from "react";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { getStockNumber, isInStock } from "@/utils/stock";

export default function TestStockPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTest = async () => {
      try {
        const wixClient = createClient({
          modules: { products },
          auth: OAuthStrategy({
            clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
          }),
        });

        const productList = await wixClient.products
          .queryProducts()
          .limit(5)
          .find();

        const results = productList.items.map((product) => ({
          id: product._id,
          name: product.name,
          rawStock: product.stock,
          stockNumber: getStockNumber(product.stock),
          inStock: isInStock(product.stock),
        }));

        setTestResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    runTest();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Stock Test Results</h1>
      
      <div className="grid gap-4">
        {testResults.map((result) => (
          <div key={result.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">{result.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Stock Number:</strong> {result.stockNumber}
              </div>
              <div>
                <strong>In Stock:</strong> {result.inStock ? 'Yes' : 'No'}
              </div>
            </div>
            <div className={`mt-2 p-2 rounded text-center font-medium ${
              result.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {result.inStock ? '✅ Available' : '❌ Out of Stock'}
            </div>
          </div>
        ))}
      </div>
      
      {testResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found for testing.</p>
        </div>
      )}
    </div>
  );
}