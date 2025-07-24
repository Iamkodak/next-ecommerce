import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { WixClientContextProvider } from "@/context/wixContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LamaStore",
  description: "A store that take care of all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WixClientContextProvider>
          <CartProvider>
            <NavBar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </WixClientContextProvider>
      </body>
    </html>
  );
}