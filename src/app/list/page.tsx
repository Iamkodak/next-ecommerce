import React from 'react';
import Image from 'next/image';
import Fliter from '@/components/Fliter';
import ProductList from '@/components/ProductList';

export default function ListPage() {
  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative'>
      {/* Campaign */}
      <div className="hidden sm:flex bg-pink-50 px-4 h-64  justify-between">
        <div className="w-2/3 flex flex-col justify-center items-center gap-8">
        <h1 className='text-4xl font-semibold leading-[48px] text-gray-700'>Grab Up to 50% off on <br/> Selected product</h1>
        <button className="rounded-3xl bg-rogue text-white w-max text-sm py-3 px-5">Buy Now</button>
        </div>
        <div className="relative w-1/3">
         <Image src="/woman.png" alt='' fill className='object-contain' />
        </div>
      </div>

      {/* Fliter */}
      <Fliter />

      {/* Product */}
      <h2 className='mt-12 text-xl font-semibold'>Shoes For You</h2>
      <ProductList />
    </div>
  )
}
