import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { cookies } from "next/headers";

export const wixClientServer = async () => {
  let refreshToken;

  try {
    const cookieStore = cookies();
    const tokenFromCookie = cookieStore.get("refreshToken")?.value;

    if (tokenFromCookie) {
      refreshToken = JSON.parse(tokenFromCookie);

      // Optional: validate shape
      if (
        typeof refreshToken !== "object" ||
        typeof refreshToken.value !== "string" ||
        typeof refreshToken.expiresAt !== "number"
      ) {
        throw new Error("Invalid refresh token structure");
      }
    }
  } catch (e) {
    console.error("Failed to parse or validate refresh token", e);
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken: refreshToken ?? { value: "", expiresAt: 0 }, // fallback
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });

  return wixClient;
};
