"use client";

import React from "react";
import Image from "next/image";

export default function CartModal() {
  const cartItems = true;

  return (
    <div className="absolute top-12 right-0 z-20 w-72 p-4 bg-white rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex flex-col gap-6">
      {!cartItems ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <>
        <h2 className="text-xl">Shopping Cart</h2>
        <div className="flex flex-col gap-8">
          {/* items */}
        <div className="flex gap-4">
          <Image
            src="https://media.istockphoto.com/id/177347141/photo/close-of-blue-flower.jpg?s=2048x2048&w=is&k=20&c=idSyn1JXWHQ8tYVGiiOEdDruDTOGvZNv-YK5LDcN-6c="
            alt=""
            width={72}
            height={96}
            className="object-cover rounded-md"
          />
          <div className="flex flex-col justify-between w-full">
            {/* Top */}
            <div className="">
              {/* title */}
              <div className="flex items-center justify-between gap-8">
                <h3 className="font-semibold">Product Name</h3>
                <div className="p-1 bg-gray-50 rounded-sm">$49</div>
              </div>
              {/* Desc */}
              <div className="text-sm text-gray-500">Available</div>
            </div>
            {/* bottom */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Qty, 2</span>
              <span className="text-blue-500">Remove</span>
            </div>
          </div>
        </div>

         {/* items */}
        <div className="flex gap-4">
          <Image
            src="https://media.istockphoto.com/id/177347141/photo/close-of-blue-flower.jpg?s=2048x2048&w=is&k=20&c=idSyn1JXWHQ8tYVGiiOEdDruDTOGvZNv-YK5LDcN-6c="
            alt=""
            width={72}
            height={96}
            className="object-cover rounded-md"
          />
          <div className="flex flex-col justify-between w-full">
            {/* Top */}
            <div className="">
              {/* title */}
              <div className="flex items-center justify-between gap-8">
                <h3 className="font-semibold ">Product Name</h3>
                <div className="p-1 bg-gray-50 rounded-sm">$49</div>
              </div>
              {/* Desc */}
              <div className="text-sm text-gray-500">Available</div>
            </div>
            {/* bottom */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Qty, 2</span>
              <span className="text-blue-500">Remove</span>
            </div>
          </div>
        </div>
         
         {/* Bottom */}
         <div className="">
          <div className="flex items-center justify-between font-semibold">
            <span className="">Subtotal</span>
            <span className="">$49</span>
          </div>
          <p className="text-gray-500 mt-2 mb-4 text-sm">
           Shipping and taxes calculated at checkout.
          </p>

          <div className="flex justify-between text-sm">
            <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">View Cart</button>
            <button className="rounded-md py-3 px-4 bg-black text-white">Checkout</button>
          </div>
         </div>
        </div>
        </>
      )}
    </div>
  );
}
