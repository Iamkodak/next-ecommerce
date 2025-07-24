// src/types/wix-types.ts
export interface WixProduct {
  _id: string;
  name: string;
  slug?: string;
  price?: {
    formatted?: {
      price?: string;
    };
    amount?: number;
  };
  media?: {
    mainMedia?: {
      image?: {
        url?: string;
      };
    };
  };
  // Add other product properties you need
}

export interface WixCollection {
  _id: string;
  name?: string;
  slug?: string;
  // Add other collection properties you need
}