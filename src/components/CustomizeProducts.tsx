import React from "react";

export default function CustomizeProducts() {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-medium">Choose A Color</h3>
      <ul className="flex items-center gap-3">
        <li className="w-8 h-8 ring-1 ring-gray-300 rounded-full  cursor-pointer relative bg-red-500">
          <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </li>
        <li className="w-8 h-8 ring-1 ring-gray-300 rounded-full  cursor-pointer relative bg-blue-500"></li>
        <li className="w-8 h-8 ring-1 ring-gray-300 rounded-full  cursor-not-allowed relative bg-green-500">
          <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </li>
      </ul>
      <h3 className="font-medium">Choose A Size</h3>
      <ul className="flex items-center gap-3">
        <li className="ring-1 ring-rogue text-rogue rounded-md py-1 px-4 text-sm cursor-pointer">Small</li>
        <li className="ring-1 ring-rogue text-white bg-rogue rounded-md py-1 px-4 text-sm cursor-pointer">Medium</li>
        <li className="ring-1 ring-pink-200 text-white bg-pink-200 rounded-md py-1 px-4 text-sm cursor-not-allowed">Large</li>
      </ul>
    </div>
  );
}
