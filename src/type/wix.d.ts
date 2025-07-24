// src/types/wix.d.ts
declare module "@wix/ecom" {
  export interface Cart {
    _id: string;
    lineItems: Array<{
      _id: string;
      productName: string;
      price: {
        amount: number;
      };
      quantity: number;
      image?: {
        url: string;
      };
    }>;
  }

  export const currentCart: {
    getCurrentCart(): Promise<Cart>;
    addToCurrentCart(options: any): Promise<Cart>;
    removeLineItemsFromCurrentCart(lineItemIds: string[]): Promise<Cart>;
    updateCurrentCartLineItemQuantity(updates: Array<{
      _id: string;
      quantity: number;
    }>): Promise<Cart>;
  };
}