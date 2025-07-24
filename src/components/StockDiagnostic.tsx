"use client";

import React, { useEffect, useState } from "react";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { getStockNumber, isInStock } from "@/utils/stock";

interface DiagnosticResult {
  productId: string;
  productName: string;
  rawStock: any;
  stockNumber: number;
  inStock: boolean;
  issues: string[];
}

export default function StockDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const wixClient = createClient({
        modules: { products },
        auth: OAuthStrategy({
          clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
        }),
      });

      // Fetch products with all stock-related fields
      const productList = await wixClient.products
        .queryProducts()
        .limit(10)
        .find();

      const results: DiagnosticResult[] = productList.items.map((product) => {
        const issues: string[] = [];
        const stockNumber = getStockNumber(product.stock);
        const inStock = isInStock(product.stock);

        // Analyze potential issues
        if (!product.stock) {
          issues.push("No stock data available");
        } else {
          if (product.stock.trackInventory === undefined && product.stock.trackQuantity === undefined) {
            issues.push("No inventory tracking information");
          }
          
          if (product.stock.quantity === undefined || product.stock.quantity === null) {
            issues.push("No quantity information");
          }
          
          if (product.stock.quantity === 0) {
            issues.push("Quantity is zero");
          }
          
          if (product.stock.inventoryStatus === 'OUT_OF_STOCK') {
            issues.push("Inventory status is OUT_OF_STOCK");
          }
          
          if (product.stock.inStock === false) {
            issues.push("inStock field is false");
          }
          
          if (stockNumber <= 0 && inStock) {
            issues.push("Inconsistent stock data: inStock=true but stockNumber<=0");
          }
          
          if (stockNumber > 0 && !inStock) {
            issues.push("Inconsistent stock data: inStock=false but stockNumber>0");
          }
        }

        return {
          productId: product._id!,
          productName: product.name || 'Unnamed Product',
          rawStock: product.stock,
          stockNumber,
          inStock,
          issues,
        };
      });

      setDiagnostics(results);
    } catch (err) {
      console.error('Diagnostic error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Stock Diagnostic Tool</h1>
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Running Diagnostic...' : 'Run Diagnostic'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-6">
        {diagnostics.map((result) => (
          <div key={result.productId} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{result.productName}</h2>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Qty: {result.stockNumber}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Raw Stock Data:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(result.rawStock, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Analysis:</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Stock Number:</strong> {result.stockNumber}</div>
                  <div><strong>Is In Stock:</strong> {result.inStock ? 'Yes' : 'No'}</div>
                  
                  {result.issues.length > 0 && (
                    <div>
                      <strong>Issues Found:</strong>
                      <ul className="list-disc list-inside mt-1 text-red-600">
                        {result.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.issues.length === 0 && (
                    <div className="text-green-600">
                      <strong>✅ No issues detected</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {diagnostics.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found for diagnostic.</p>
        </div>
      )}
    </div>
  );
}