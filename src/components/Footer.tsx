import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className='py-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative bg-gray-200 text-sm mt-24'>
      {/* Top */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* Left */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
         <Link href="/">
           <div className='text-2xl tracking-wide'>
            LAMA
            </div>
         </Link>
         <p> 8731 & 8741 Pioneer Blvd, Santa Fe Springs, CA 90670,United States</p>
         <span className="font-semibold">hello@lama.store</span>
         <span className="font-semibold">+1(562) 547-8994</span>
         <div className="flex gap-6">
          <Image src='/facebook.png' alt='' width={16} height={16} />
          <Image src='/instagram.png' alt='' width={16} height={16} />
          <Image src='/pinterest.png' alt='' width={16} height={16} />
          <Image src='/youtube.png' alt='' width={16} height={16} />
          <Image src='/x.png' alt='' width={16} height={16} />
         </div>
        </div>
        {/* Center */}
        <div className="w-1/2 hidden lg:flex justify-between">
          <div className="flex flex-col justify-between">
            <h1 className='font-medium text-lg'>Company</h1>
            <div className="flex flex-col gap-6">
              <Link href="">About Us</Link>
              <Link href="">Careers</Link>
              <Link href="">Affiliates</Link>
              <Link href="">Blog</Link>
              <Link href="">Contact Us</Link>
            </div>
          </div>

           <div className="flex flex-col justify-between">
            <h1 className='font-medium text-lg'>Shop</h1>
            <div className="flex flex-col gap-6">
              <Link href="">New Arrivals</Link>
              <Link href="">Accessories</Link>
              <Link href="">Men</Link>
              <Link href="">Women</Link>
              <Link href="">All Product</Link>
            </div>
          </div>

           <div className="flex flex-col justify-between">
            <h1 className='font-medium text-lg'>Help</h1>
            <div className="flex flex-col gap-6">
              <Link href="">Customer Service</Link>
              <Link href="">My Account</Link>
              <Link href="">Find A Store</Link>
              <Link href="">Legal & Privacy</Link>
              <Link href="">Gift Card</Link>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
         <h1 className="font-medium text-lg">SUBSCRIBE</h1>
         <p>Be the first to get the lastest news about trends, promotions, and much more!</p>
         <div className="flex">
          <input type="text" placeholder='Email Address' className='p-4 w-3/4' />
          <button className="w-1/4 bg-rogue text-white">Join</button>
         </div>
          <span className="font-semibold">Secure Payments</span>
          <div className="flex justify-between">
            <Image src="/discover.png" alt='' width={40} height={20} />
            <Image src="/skrill.png" alt='' width={40} height={20} />
            <Image src="/paypal.png" alt='' width={40} height={20} />
            <Image src="/mastercard.png" alt='' width={40} height={20} />
            <Image src="/visa.png" alt='' width={40} height={20} />
          </div>
        </div>
      </div>
      {/* Bottom */}
      <div className="flex flex-col md:flex-row justify-between  items-center gap-8 mt-16">
       <div className="">© 2025 Rogue Group</div>
       <div className="flex  md:flex-row gap-8">
        <span className="text-gray-500">Language</span>
        <span className="font-medium text-sm">United States | English</span>
       </div>

       <div className="flex  md:flex-row gap-8 mobile-to-lg:text-center">
        <span className="text-gray-500">Currency</span>
        <span className="font-medium">$ USD</span>
       </div>
      </div>
    </div>
  )
}
