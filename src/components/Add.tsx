"use client";

import React, { useState } from "react";

export default function Add() {

  // Temporary
  const stock = 4
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }

    if (type === "i" && quantity< stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="">Choose A Quantity</h3>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl"
              onClick={() => handleQuantity("d")}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl"
              onClick={() => handleQuantity("i")}
            >
              +
            </button>
          </div>
          <div className="text-xs">
            Only <span className="text-orange-400">4 items</span> left! <br />{" "}
            {"Don't"} {""}miss it
          </div>
        </div>
        <button className="w-36 rounded-3xl ring-1 text-sm ring-rogue text-rogue py-2 px-4 hover:bg-rogue hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
          Add To Cart
        </button>
      </div>
    </div>
  );
}
