// Stock fixer utility to help resolve common stock issues

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

export interface StockFixResult {
  success: boolean;
  message: string;
  productCount: number;
  issues: string[];
  fixes: string[];
}

export async function diagnoseStockIssues(): Promise<StockFixResult> {
  const issues: string[] = [];
  const fixes: string[] = [];
  
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_WIX_CLIENT_ID) {
      issues.push("Missing NEXT_PUBLIC_WIX_CLIENT_ID environment variable");
      fixes.push("Add NEXT_PUBLIC_WIX_CLIENT_ID to your .env.local file");
    }

    const wixClient = createClient({
      modules: { products },
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      }),
    });

    // Test connection
    const testQuery = await wixClient.products.queryProducts().limit(1).find();
    
    if (testQuery.items.length === 0) {
      issues.push("No products found in Wix store");
      fixes.push("Add products to your Wix store or check your store connection");
      return {
        success: false,
        message: "No products found",
        productCount: 0,
        issues,
        fixes,
      };
    }

    // Fetch more products for analysis
    const productList = await wixClient.products
      .queryProducts()
      .limit(20)
      .find();

    let outOfStockCount = 0;
    let noStockDataCount = 0;
    let trackingDisabledCount = 0;

    productList.items.forEach((product) => {
      if (!product.stock) {
        noStockDataCount++;
      } else {
        // Check for common issues
        if (product.stock.inventoryStatus === 'OUT_OF_STOCK') {
          outOfStockCount++;
        }
        
        if (product.stock.trackInventory === false && product.stock.trackQuantity === false) {
          trackingDisabledCount++;
        }
        
        if (product.stock.quantity === 0) {
          outOfStockCount++;
        }
      }
    });

    // Analyze results
    if (noStockDataCount > 0) {
      issues.push(`${noStockDataCount} products have no stock data`);
      fixes.push("Ensure products have stock information configured in Wix");
    }

    if (outOfStockCount === productList.items.length) {
      issues.push("All products are showing as out of stock");
      fixes.push("Check product inventory settings in your Wix dashboard");
      fixes.push("Verify that inventory tracking is properly configured");
    }

    if (trackingDisabledCount === productList.items.length) {
      issues.push("All products have inventory tracking disabled");
      fixes.push("Enable inventory tracking for products that should have limited stock");
    }

    return {
      success: issues.length === 0,
      message: issues.length === 0 ? "No stock issues detected" : `Found ${issues.length} potential issues`,
      productCount: productList.items.length,
      issues,
      fixes,
    };

  } catch (error) {
    issues.push(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    fixes.push("Check your Wix API credentials and connection");
    
    return {
      success: false,
      message: "Failed to diagnose stock issues",
      productCount: 0,
      issues,
      fixes,
    };
  }
}

export function getStockRecommendations(stock: any): string[] {
  const recommendations: string[] = [];
  
  if (!stock) {
    recommendations.push("Configure stock information for this product");
    return recommendations;
  }

  if (stock.trackInventory === undefined && stock.trackQuantity === undefined) {
    recommendations.push("Set trackInventory or trackQuantity to true/false explicitly");
  }

  if (stock.quantity === undefined || stock.quantity === null) {
    recommendations.push("Set a specific quantity value");
  }

  if (stock.inventoryStatus === 'OUT_OF_STOCK' && stock.quantity > 0) {
    recommendations.push("Inventory status conflicts with quantity - check Wix dashboard");
  }

  if (stock.inStock === false && stock.quantity > 0) {
    recommendations.push("inStock field conflicts with quantity - check product settings");
  }

  return recommendations;
}