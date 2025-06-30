"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImage {
  id: string | number;
  url: string;
}

interface ProductImagesProps {
  mainImage?: string;
  additionalImages?: string[];
}

export default function ProductImages({ 
  mainImage, 
  additionalImages = [] 
}: ProductImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine all images (main + additional)
  const allImages: ProductImage[] = [
    ...(mainImage ? [{ id: 'main', url: mainImage }] : []),
    ...additionalImages.map((url, index) => ({ 
      id: `additional-${index}`, 
      url 
    }))
  ];

  // Fallback if no images are provided
  if (allImages.length === 0) {
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
          src={allImages[activeIndex].url}
          alt={`Product image ${activeIndex + 1}`}
          fill
          sizes="50vw"
          className="object-cover rounded-md"
          priority
        />
      </div>

      {/* Thumbnail navigation */}
      {allImages.length > 1 && (
        <div className="flex justify-between gap-4 mt-8">
          {allImages.map((img, index) => (
            <div 
              className={`w-1/4 h-32 relative rounded-md overflow-hidden cursor-pointer border-2 ${
                activeIndex === index ? 'border-blue-500' : 'border-transparent'
              }`}
              key={img.id}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
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