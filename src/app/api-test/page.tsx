import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

export default async function ApiTestPage() {
  try {
    const wixClient = createClient({
      modules: { products },
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      }),
    });

    // Simple test query without .include()
    const productList = await wixClient.products.queryProducts().limit(3).find();
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">API Test Results</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Successfully connected to Wix API
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Products Found: {productList.items.length}</h2>
        </div>

        <div className="space-y-4">
          {productList.items.map((product, index) => (
            <div key={product._id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Product {index + 1}: {product.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Info:</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>ID:</strong> {product._id}</div>
                    <div><strong>Name:</strong> {product.name}</div>
                    <div><strong>Slug:</strong> {product.slug || 'N/A'}</div>
                    <div><strong>Price:</strong> ${product.price?.price || 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Stock Data:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(product.stock, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Full Product Data:</h4>
                <details className="bg-gray-50 p-2 rounded">
                  <summary className="cursor-pointer text-sm font-medium">Click to expand</summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-40">
                    {JSON.stringify(product, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>
        
        {productList.items.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            ⚠️ No products found. Check your Wix store configuration.
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">API Test Results</h1>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-semibold mb-2">❌ API Connection Failed</h2>
          <p><strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown error'}</p>
          <pre className="mt-2 text-sm bg-red-50 p-2 rounded overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}