import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import React from "react";

export default function SinglePage() {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* Image section */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages />
      </div>
      {/* Text Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h2 className="text-4xl font-medium">Product Name</h2>
        <p className="text-gray-500">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo, ullam
          nesciunt harum rerum, assumenda est quis porro impedit dignissimos
          distinctio dolor quasi at! Aut incidunt voluptas excepturi quo dolore
          nihil!
        </p>
        <div className="h-[2px] bg-gray-100" />
        <div className="flex items-center gap-4">
          <h3 className="text-2xl text-gray-500 line-through">$59</h3>
          <h2 className="font-medium text-2xl">$49</h2>
        </div>
        <div className="h-[2px] bg-gray-100" />
        <CustomizeProducts />
        <Add />
        <div className="h-[2px] bg-gray-100" />

        <div className="text-sm">
          <h3 className="font-medium mb-4">Title</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
            maiores modi quasi, et, eveniet debitis consequuntur eius natus
            ratione corrupti vitae amet iste suscipit facilis tempora? Placeat
            est a corrupti!
          </p>
        </div>

        <div className="text-sm">
          <h3 className="font-medium mb-4">Title</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
            maiores modi quasi, et, eveniet debitis consequuntur eius natus
            ratione corrupti vitae amet iste suscipit facilis tempora? Placeat
            est a corrupti!
          </p>
        </div>

        <div className="text-sm">
          <h3 className="font-medium mb-4">Title</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
            maiores modi quasi, et, eveniet debitis consequuntur eius natus
            ratione corrupti vitae amet iste suscipit facilis tempora? Placeat
            est a corrupti!
          </p>
        </div>
      </div>
    </div>
  );
}
