// "use client";

import CatergoryList from "@/components/CatergoryList";
import ProductList from "@/components/ProductList";
import NewProducts from "@/components/NewProducts";
import Slider from "@/components/Slider";
import { WixClientContext } from "@/context/wixContext";
import { Suspense, useContext, useEffect } from "react";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

const HomePage = async () => {
  // const wixClient = useContext(WixClientContext);

  // useEffect(() => {
  //   const getProducts = async () => {
  //     const res = await wixClient.products.queryProducts().find();

  //     console.log(res)
  //   };

  //   getProducts();
  // }, [wixClient]);
  const featuredCategoryId =
    process.env.NEXT_PUBLIC_FEATURED_PRODUCTS_CATEGORY_ID;

  const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  // const productList = await wixClient.products.queryProducts().find();

  // console.log("Total Products:", productList.items.length);
  // console.log(
  //   "Product Names:",
  //   productList.items.map((p) => p.name).join("\n")
  // );

  return (
    <div className="">
      <Slider />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={"loading"}>
          <ProductList categoryId={process.env.NEXT_PUBLIC_FEATURED_PRODUCTS_CATEGORY_ID!} limit={4}/>
        </Suspense>
      </div>

      <div className="mt-24 ">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">
          Categories
        </h1>
        <Suspense fallback={"loading"}>
        <CatergoryList />
        </Suspense>
      </div>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">New Products</h1>
        <Suspense fallback={"loading"}>
          <NewProducts limit={4} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
