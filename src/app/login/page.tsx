import React from "react";

const wixClientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_WIX_REDIRECT_URI;

// Wix OAuth URL for Google login (force Google as the provider)
const googleLoginUrl = `https://www.wix.com/installer/install?client_id=${wixClientId}&redirect_uri=${encodeURIComponent(redirectUri || '')}&response_type=code&scope=openid%20offline_access&provider=google`;

// Wix OAuth URL for email login (default Wix login screen)
const emailLoginUrl = `https://www.wix.com/installer/install?client_id=${wixClientId}&redirect_uri=${encodeURIComponent(redirectUri || '')}&response_type=code&scope=openid%20offline_access`;

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <div className="flex flex-col gap-4">
          <a href={googleLoginUrl}>
            <button className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition">Login with Google</button>
          </a>
          <a href={emailLoginUrl}>
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login with Email</button>
          </a>
        </div>
      </div>
    </div>
  );
}
