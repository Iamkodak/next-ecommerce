import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { notFound } from "next/navigation";

export default async function SinglePage({
  params,
}: {
  params: { slug: string };
}) {
  const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  try {
    // Fetch product by slug
    const result = await wixClient.products
      .queryProducts()
      .eq("slug", params.slug)
      .limit(1)
      .find();

    if (!result.items.length) {
      return notFound();
    }

    const product = result.items[0];

    // Ensure additionalImages is strictly string[]
    const additionalImages = (product.media?.items || [])
      .map((item) => item.image?.url)
      .filter((url): url is string => url !== undefined);

    return (
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
        {/* Image section */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages
            mainImage={product.media?.mainMedia?.image?.url}
            additionalImages={additionalImages}
          />
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h2 className="text-4xl font-medium">{product.name}</h2>
          <p className="text-gray-500">
            {product.description || "No description available"}
          </p>

          <div className="h-[2px] bg-gray-100" />

          {/* Price display */}
          <div className="flex items-center gap-4">
            {product.price?.discountedPrice ? (
              <>
                <h3 className="text-2xl text-gray-500 line-through">
                  ${product.price?.price}
                </h3>
                <h2 className="font-medium text-2xl">
                  ${product.price?.discountedPrice}
                </h2>
              </>
            ) : (
              <h2 className="font-medium text-2xl">
                ${product.price?.price || "N/A"}
              </h2>
            )}
          </div>

          <div className="h-[2px] bg-gray-100" />

          {/* Product options */}
          <CustomizeProducts options={product.productOptions} />

          {/* Add to cart - product._id is guaranteed to exist */}
          <Add productId={product._id!} />

          <div className="h-[2px] bg-gray-100" />

          {/* Additional info sections */}
          {product.additionalInfoSections?.map((section, index) => (
            <div className="text-sm" key={index}>
              <h3 className="font-medium mb-4">{section.title}</h3>
              <p>{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
}
