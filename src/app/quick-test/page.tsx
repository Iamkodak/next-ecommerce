import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

export default async function QuickTestPage() {
  try {
    console.log("Starting quick test...");
    
    const wixClient = createClient({
      modules: { products },
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      }),
    });

    console.log("Wix client created, fetching products...");
    
    // Simple test query
    const productList = await wixClient.products.queryProducts().limit(2).find();
    
    console.log("Products fetched:", productList.items.length);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quick Test Results</h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ API Connection Successful!
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Products Found: {productList.items.length}</h2>
        </div>

        {productList.items.map((product, index) => (
          <div key={product._id} className="bg-white border rounded-lg p-4 shadow-sm mb-4">
            <h3 className="font-semibold mb-2">Product {index + 1}: {product.name}</h3>
            
            <div className="text-sm space-y-1">
              <div><strong>ID:</strong> {product._id}</div>
              <div><strong>Price:</strong> ${product.price?.price || 'N/A'}</div>
              <div><strong>Has Stock Data:</strong> {product.stock ? 'Yes' : 'No'}</div>
              {product.stock && (
                <div><strong>Stock Info:</strong> {JSON.stringify(product.stock)}</div>
              )}
            </div>
          </div>
        ))}
        
        {productList.items.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            ⚠️ No products found. Check your Wix store configuration.
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Quick test error:", error);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quick Test Results</h1>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-semibold mb-2">❌ API Connection Failed</h2>
          <p><strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown error'}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-sm bg-red-50 p-2 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}