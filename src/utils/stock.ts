// Utility functions for handling product stock

export interface StockInfo {
  trackInventory?: boolean;
  quantity?: number;
  inStock?: boolean;
  inventoryStatus?: string;
  // Additional Wix stock fields that might be present
  trackQuantity?: boolean;
  inventoryItemId?: string;
  variants?: any[];
}

/**
 * Calculate the available stock number for a product
 * @param stock - The stock information from the product
 * @returns The available stock quantity (999 if inventory tracking is disabled)
 */
export function getStockNumber(stock?: StockInfo): number {
  // Debug log to see what we're getting
  console.log('getStockNumber called with:', JSON.stringify(stock, null, 2));
  
  // If stock is undefined or null, assume unlimited stock
  if (!stock) {
    console.log('No stock info, returning 999');
    return 999;
  }

  // Check for various possible stock status indicators
  if (stock.inventoryStatus === 'OUT_OF_STOCK') {
    console.log('Inventory status is OUT_OF_STOCK');
    return 0;
  }

  if (stock.inventoryStatus === 'IN_STOCK') {
    console.log('Inventory status is IN_STOCK, checking quantity');
    // Even if marked as IN_STOCK, check the actual quantity
    const quantity = stock.quantity || 999;
    console.log('IN_STOCK with quantity:', quantity);
    return quantity;
  }

  // Check if there's an explicit inStock field (some Wix products use this)
  if (stock.inStock === false) {
    console.log('Product explicitly marked as out of stock');
    return 0;
  }

  // Check trackQuantity field (alternative to trackInventory)
  if (stock.trackQuantity === false || stock.trackInventory === false) {
    console.log('Inventory tracking disabled (trackQuantity or trackInventory), returning 999');
    return 999;
  }

  // If trackInventory or trackQuantity is true, use the quantity
  if (stock.trackInventory === true || stock.trackQuantity === true) {
    const quantity = stock.quantity || 0;
    console.log('Inventory tracking enabled, quantity:', quantity);
    return quantity;
  }

  // If trackInventory is undefined or null, check if we have quantity info
  if (stock.trackInventory === undefined || stock.trackInventory === null) {
    // If we have a quantity, use it; otherwise assume unlimited
    if (typeof stock.quantity === 'number') {
      console.log('No tracking info but quantity available:', stock.quantity);
      return stock.quantity;
    }
    console.log('No tracking info and no quantity, returning 999');
    return 999;
  }

  // Default fallback
  console.log('Fallback case, returning 999');
  return 999;
}

/**
 * Check if a product is in stock
 * @param stock - The stock information from the product
 * @returns True if the product is in stock
 */
export function isInStock(stock?: StockInfo): boolean {
  // Debug log to see what we're getting
  console.log('isInStock called with:', JSON.stringify(stock, null, 2));
  
  // If stock is undefined or null, assume it's in stock
  if (!stock) {
    console.log('No stock info, returning true');
    return true;
  }

  // Check for various possible stock status indicators
  if (stock.inventoryStatus === 'OUT_OF_STOCK') {
    console.log('Inventory status is OUT_OF_STOCK, returning false');
    return false;
  }

  if (stock.inventoryStatus === 'IN_STOCK') {
    console.log('Inventory status is IN_STOCK, checking quantity');
    // Even if marked as IN_STOCK, verify with quantity if available
    if (typeof stock.quantity === 'number') {
      const inStock = stock.quantity > 0;
      console.log('IN_STOCK status with quantity check:', inStock, 'quantity:', stock.quantity);
      return inStock;
    }
    console.log('IN_STOCK status without quantity info, returning true');
    return true;
  }

  // Check if there's an explicit inStock field (some Wix products use this)
  if (typeof stock.inStock === 'boolean') {
    console.log('Using explicit inStock field:', stock.inStock);
    return stock.inStock;
  }

  // If inventory tracking is explicitly disabled, it's always in stock
  if (stock.trackInventory === false || stock.trackQuantity === false) {
    console.log('Inventory tracking disabled, returning true');
    return true;
  }

  // If trackInventory or trackQuantity is true, check the quantity
  if (stock.trackInventory === true || stock.trackQuantity === true) {
    const inStock = (stock.quantity || 0) > 0;
    console.log('Inventory tracking enabled, in stock:', inStock, 'quantity:', stock.quantity);
    return inStock;
  }

  // If trackInventory is undefined or null, check quantity
  if (stock.trackInventory === undefined || stock.trackInventory === null) {
    // If we have a quantity, check if it's > 0; otherwise assume in stock
    if (typeof stock.quantity === 'number') {
      const inStock = stock.quantity > 0;
      console.log('No tracking info but quantity available, in stock:', inStock, 'quantity:', stock.quantity);
      return inStock;
    }
    console.log('No tracking info and no quantity, returning true');
    return true;
  }

  // Default fallback
  console.log('Fallback case, returning true');
  return true;
}