// src/lib/wixClient.ts
import { createClient, OAuthStrategy } from '@wix/sdk';
import { products, collections } from '@wix/stores';

// Add error handling and validation
if (!process.env.NEXT_PUBLIC_WIX_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_WIX_CLIENT_ID is not defined in environment variables');
}

export const wixClient = createClient({
  modules: { products, collections },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
  }),
});

// Test function to verify connection
export async function testWixConnection() {
  try {
    const result = await wixClient.products.queryProducts().limit(1).find();
    console.log('Wix connection test successful:', result.items.length > 0 ? 'Products found' : 'No products found');
    return true;
  } catch (error) {
    console.error('Wix connection test failed:', error);
    return false;
  }
}