import React from "react";

export default function Fliter() {
  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-6 flex-wrap">
        <select
          name="type"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#ebeded]"
        >
          <option value="">Type</option>
          <option value="Physical">Phyiscal</option>
          <option value="Digitial">Digitial</option>
        </select>
        <input
          type="text"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
        />
        <input
          type="text"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
        />

        <select
          name="size"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#ebeded]"
        >
          <option>Size</option>
          <option value="size">Size</option>
        </select>

        <select
          name="color"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#ebeded]"
        >
          <option>Color</option>
          <option value="text">Test</option>
        </select>

        <select
          name="ribbon"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#ebeded]"
        >
          <option>Category</option>
          <option value="size">New Arrivals</option>
          <option value="">Popular</option>
        </select>

        <select
          name="ribbon"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#ebeded]"
        >
          <option>All Filter</option>
        </select>
      </div>
      <div className="">
        <select name="" id="" className="py-2 px-4 text-xs font-medium bg-white ring-1 ring-gray-400">
         <option value="">Sort By</option>
         <option value="">Price(Low to High)</option>
         <option value="">Price (High to Low)</option>
         <option value="">Newest</option>
         <option value="">Oldest</option>
        </select>
      </div>
    </div>
  );
}
