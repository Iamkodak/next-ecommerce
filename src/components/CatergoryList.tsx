import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";

export default async function CategoryList() {
  const wixClient = createClient({
    modules: { collections },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  const result = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {result.items.map((item) => {
          // Safely extract the image URL
          const imageUrl = item.media?.mainMedia?.image?.url;

          return (
            <Link
              href={`/list?cat=${item.slug}`}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
              key={item._id}
            >
              <div className="relative bg-slate-100 w-full h-96">
                <Image
                  src={imageUrl || "/default-category.png"}
                  alt={item.name || "Category image"}
                  fill
                  sizes="20vw"
                  className="object-cover"
                  priority={true}
                />
              </div>
              <h2 className="mt-8 font-light text-xl tracking-wide">
                {item.name}
              </h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
