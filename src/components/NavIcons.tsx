"use client";

import React, { useState } from 'react';
import { CircleUserRound, Bell, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWixAuth } from "@/context/wixContext";
import CartModal from './CartModal';
import Cookies from 'js-cookie';

export default function NavIcons() {
   const [isProfileOpen, setIsProfileOpen] = useState(false);
   const { cartCount, setCartVisible, error } = useCart();
   const { isAuthenticated } = useWixAuth();
   const router = useRouter();

   const handleProfile = () => {
    if (!isAuthenticated) {
       router.push("/login");
       return;
    }
    setIsProfileOpen((prev) => !prev);
   }

   const handleLogout = () => {
    Cookies.remove("refreshToken");
    setIsProfileOpen(false);
    router.push("/");
    window.location.reload(); // Refresh to update auth state
   }

  return (
    <div className='flex items-center gap-4 xl:gap-6 relative'>
        <CircleUserRound 
            className='cursor-pointer w-6 h-6 text-gray-700 hover:text-indigo-600 transition' 
            onClick={handleProfile} 
        />

        {isProfileOpen && isAuthenticated && (
            <div className="absolute p-4 rounded-md top-12 left-0 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 bg-white">
                <Link href="/profile" className="block hover:text-indigo-600 transition">Profile</Link>
                <div className="mt-2 cursor-pointer hover:text-indigo-600 transition" onClick={handleLogout}>LogOut</div>
            </div>
        )}
        
        <Bell className='cursor-pointer w-6 h-6 text-gray-700 hover:text-indigo-600 transition' />
        
        <div className="relative cursor-pointer" onClick={() => setCartVisible(true)}>
            <ShoppingCart className='cursor-pointer w-6 h-6 text-gray-700 hover:text-indigo-600 transition'/>
            {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {cartCount}
                </div>
            )}
        </div>
        
        {error && (
            <div className="absolute top-12 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20 max-w-xs">
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        <CartModal />
    </div>
  )
}