"use client";

import React, { useState } from "react";
import Image from "next/image";

const images = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1750456729462-8f2da0dd441f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    id: 2,
    url: "https://images.unsplash.com/photo-1750378112167-58d9d3788eef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    id: 3,
    url: "https://images.unsplash.com/photo-1750337361912-bfa9b786610d?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    id: 4,
    url: "https://plus.unsplash.com/premium_photo-1750792817723-be3f7b09b227?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function ProductImages() {

     const [index, setIndex] = useState(0);

  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={images[index].url}
          alt=""
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8 cursor-pointer">
        {images.map((img, i )=> (
            <div className="w-1/4 relative h-32 gap-4 mt-8" key={img.id} onClick={() =>setIndex(i)}>
          <Image
            src={img.url}
            alt=""
            fill
            sizes="30vw"
            className="object-cover rounded-md"
          />
        </div>
        ))}
        </div>
      </div>
  );
}
