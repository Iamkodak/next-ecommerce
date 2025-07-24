"use client";

import React from "react";
import { getStockNumber, isInStock } from "@/utils/stock";

interface StockDebugProps {
  stock?: any;
  productName?: string;
}

export default function StockDebug({ stock, productName }: StockDebugProps) {
  const stockNumber = getStockNumber(stock);
  const inStock = isInStock(stock);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 className="font-bold text-yellow-800 mb-2">
        Stock Debug - {productName}
      </h4>
      <div className="text-sm space-y-1">
        <div><strong>Raw stock data:</strong> {JSON.stringify(stock, null, 2)}</div>
        <div><strong>Stock number:</strong> {stockNumber}</div>
        <div><strong>Is in stock:</strong> {inStock ? 'Yes' : 'No'}</div>
        <div><strong>Track inventory:</strong> {stock?.trackInventory?.toString() || 'undefined'}</div>
        <div><strong>Quantity:</strong> {stock?.quantity?.toString() || 'undefined'}</div>
        <div><strong>In stock field:</strong> {stock?.inStock?.toString() || 'undefined'}</div>
      </div>
    </div>
  );
}