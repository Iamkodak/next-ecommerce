import Link from 'next/link'
import React from 'react'
import Menuu from './Menu'
import Image from 'next/image'
import SearchBar from './SearchBar'
import NavIcons from './NavIcons'

export default function NavBar() {
  return (
    <>
    <div className='h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative'>
      {/* Mobile */}
       <div className='h-full flex items-center justify-between md:hidden'>
        <Link href='/'>
         <div className='text-2xl tracking-wide'>LAMA</div>
        </Link>
        <Menuu />
       </div>

       {/* Bigger Screens */}
       <div className='max-md:hidden flex items-center justify-between gap-8 h-full'>
          {/* Left */}
          <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
           <Link href="/" className='flex items-center gap-3'>
           <Image src="/logo.png" alt='LamaStore Logo' width={24} height={24} />
           <div className='text-2xl tracking-wide'>LAMA</div>
           </Link>
           <div className="hidden xl:flex gap-4">
            <Link href="/">HomePage</Link>
            <Link href="/">Shop</Link>
            <Link href="/">Deals</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>
           </div>
          </div>
          {/* Right */}
          <div className="w-2/3 flex items-center justify-between">
            <SearchBar />
            <NavIcons />
          </div>
       </div>
    </div>
    </>
  )
}
