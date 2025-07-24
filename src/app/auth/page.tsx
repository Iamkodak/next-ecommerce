"use client";

import { useWixClient } from "@/context/wixContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AuthCallback() {
  const wixClient = useWixClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        
        if (!code || !state) {
          throw new Error("Missing authentication parameters");
        }

        const oAuthData = localStorage.getItem("oAuthRedirectData");
        if (!oAuthData) {
          throw new Error("Missing OAuth data");
        }

        const parsedOAuthData = JSON.parse(oAuthData);
        
        const { accessToken, refreshToken } = await wixClient.auth.getMemberTokens(
          code,
          state,
          parsedOAuthData
        );

        // Store tokens in cookies
        Cookies.set("refreshToken", JSON.stringify(refreshToken), {
          expires: 30, // 30 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
        });

        // Clean up localStorage
        localStorage.removeItem("oAuthRedirectData");

        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Authentication failed. Please try again.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuth();
  }, [wixClient, router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait while we set up your account...</p>
      </div>
    </div>
  );
}