import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { notFound } from "next/navigation";
import ProductImages from "@/components/ProductImages";
import CustomizeProducts from "@/components/CustomizeProducts";
import Add from "@/components/Add";
import DOMPurify from "isomorphic-dompurify";
import { getStockNumber, isInStock } from "@/utils/stock";
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

const SinglePage = async ({ params }: Props) => {
  const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  const productList = await wixClient.products
    .queryProducts()
    .eq("slug", params.slug)
    .find();

  if (!productList.items[0]) {
    return notFound();
  }

  const product = productList.items[0];
  const sanitizedStock = product.stock
    ? {
        ...product.stock,
        quantity: typeof product.stock.quantity === 'number' ? product.stock.quantity : undefined,
      }
    : undefined;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.media?.items} />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isInStock(sanitizedStock) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isInStock(sanitizedStock) ? 'In Stock' : 'Out of Stock'}
          </span>
          <span className="text-sm text-gray-500">
            ({getStockNumber(sanitizedStock)} available)
          </span>
        </div>

        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />

        {product.price?.price === product.price?.discountedPrice ? (
          <h2 className="font-medium text-2xl">${product.price?.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">${product.price?.price}</h3>
            <h2 className="font-medium text-2xl">${product.price?.discountedPrice}</h2>
          </div>
        )}

        <div className="h-[2px] bg-gray-100" />

        {product.variants && product.productOptions ? (
          <>
            <CustomizeProducts
              productId={product._id!}
              variants={product.variants}
              productOptions={product.productOptions}
            />
            <Add
              productId={product._id!}
              variantId="00000000-0000-0000-0000-000000000000"
              stockNumber={getStockNumber(sanitizedStock)}
            />
          </>
        ) : (
          <Add
            productId={product._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={getStockNumber(sanitizedStock)}
          />
        )}

        <div className="h-[2px] bg-gray-100" />
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(section.description),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePage;
