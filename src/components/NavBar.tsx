"use client"; // This must be the FIRST line in the file

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { useCart } from "@/context/CartContext";
import Menuu from './Menu';
import SearchBar from './SearchBar';
import NavIcons from './NavIcons';

export default function NavBar() {
  const { cartCount, setCartVisible } = useCart();

  return (
    <nav className='h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative md:sticky top-0 z-50 bg-white shadow-sm'>
      {/* Mobile View */}
      <div className='h-full flex items-center justify-between md:hidden'>
        <div className="flex flex-row gap-2">
          <Image src="/logo.png" alt='' width={30} height={30} />
        <Link href='/' className='text-2xl tracking-wide hover:text-indigo-600 transition'>
          LAMA
        </Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCartVisible(true)}
            className="relative p-2 text-gray-700 hover:text-indigo-600 transition"
            aria-label="Shopping Cart"
          >
            
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </button>
          <Menuu />
        </div>
      </div>

      {/* Desktop View */}
      <div className='hidden md:flex items-center justify-between gap-8 h-full'>
        {/* Left Side */}
        <div className="w-2/5 xl:w-3/5 flex items-center gap-8">
          <Link href="/" className='flex items-center gap-2 hover:text-indigo-600 transition'>
            <Image src="/logo.png" alt='' width={30} height={30} />
            <span className='text-2xl tracking-wide'>LAMA</span>
          </Link>
          <div className="hidden xl:flex gap-6">
            <Link href="/" className="hover:text-indigo-600 transition">HomePage</Link>
            <Link href="/products" className="hover:text-indigo-600 transition">Shop</Link>
            <Link href="/deals" className="hover:text-indigo-600 transition">Deals</Link>
            <Link href="/about" className="hover:text-indigo-600 transition">About</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition">Contact</Link>
          </div>
        </div>
        
        {/* Right Side */}
        <div className="w-3/5 xl:w-2/5 flex items-center justify-end gap-4">
          <SearchBar/>
          <NavIcons />
        </div>
      </div>
    </nav>
  )
}