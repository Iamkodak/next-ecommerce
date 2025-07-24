"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MediaItem {
  image?: {
    url?: string;
  };
  video?: {
    files?: {
      url?: string;
    }[];
  };
}

interface ProductImagesProps {
  items?: MediaItem[];
}

export default function ProductImages({ items }: ProductImagesProps) {
  const [index, setIndex] = useState(0);

  // Filter out items without valid image URLs
  const validImages = items?.filter(item => item.image?.url) || [];

  if (validImages.length === 0) {
    return (
      <div className="h-[500px] relative bg-gray-100 rounded-md flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="">
      {/* Main image display */}
      <div className="h-[500px] relative">
        <Image
          src={validImages[index].image?.url || "/product.png"}
          alt="Product image"
          fill
          sizes="50vw"
          className="object-cover rounded-md"
          priority
        />
      </div>

      {/* Thumbnail navigation */}
      {validImages.length > 1 && (
        <div className="flex justify-between gap-4 mt-8">
          {validImages.map((item, i) => (
            <div 
              className={`w-1/4 h-32 relative rounded-md overflow-hidden cursor-pointer border-2 ${
                index === i ? 'border-blue-500' : 'border-transparent'
              }`}
              key={i}
              onClick={() => setIndex(i)}
            >
              <Image
                src={item.image?.url || "/product.png"}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}