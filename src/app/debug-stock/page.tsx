import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { getStockNumber, isInStock } from "@/utils/stock";
import { diagnoseStockIssues, getStockRecommendations } from "@/utils/stockFixer";

export default async function DebugStockPage() {
  const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    }),
  });

  // Run diagnostic first
  const diagnostic = await diagnoseStockIssues();

  try {
    const productList = await wixClient.products.queryProducts().limit(10).find();
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Stock Debug Page</h1>
        
        {/* Diagnostic Summary */}
        <div className={`p-4 rounded-lg mb-8 ${
          diagnostic.success ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
        } border`}>
          <h2 className="text-xl font-semibold mb-4">Diagnostic Summary</h2>
          <p className="mb-2"><strong>Status:</strong> {diagnostic.message}</p>
          <p className="mb-4"><strong>Products Analyzed:</strong> {diagnostic.productCount}</p>
          
          {diagnostic.issues.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Issues Found:</h3>
              <ul className="list-disc list-inside space-y-1">
                {diagnostic.issues.map((issue, index) => (
                  <li key={index} className="text-red-700">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {diagnostic.fixes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Recommended Fixes:</h3>
              <ul className="list-disc list-inside space-y-1">
                {diagnostic.fixes.map((fix, index) => (
                  <li key={index} className="text-blue-700">{fix}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {productList.items.map((product) => (
            <div key={product._id} className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Raw Stock Data:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(product.stock, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Processed Stock Info:</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Stock Number:</strong> {getStockNumber(product.stock)}</div>
                    <div><strong>Is In Stock:</strong> {isInStock(product.stock) ? 'Yes' : 'No'}</div>
                    <div><strong>Track Inventory:</strong> {product.stock?.trackInventory?.toString() || 'undefined'}</div>
                    <div><strong>Track Quantity:</strong> {product.stock?.trackQuantity?.toString() || 'undefined'}</div>
                    <div><strong>Quantity:</strong> {product.stock?.quantity?.toString() || 'undefined'}</div>
                    <div><strong>In Stock Field:</strong> {product.stock?.inStock?.toString() || 'undefined'}</div>
                    <div><strong>Inventory Status:</strong> {product.stock?.inventoryStatus || 'undefined'}</div>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {getStockRecommendations(product.stock).map((rec, index) => (
                        <li key={index} className="text-blue-600">{rec}</li>
                      ))}
                      {getStockRecommendations(product.stock).length === 0 && (
                        <li className="text-green-600">No issues detected</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded" style={{
                backgroundColor: isInStock(product.stock) ? '#dcfce7' : '#fecaca'
              }}>
                <strong>Status: </strong>
                {isInStock(product.stock) ? 
                  `✅ In Stock (${getStockNumber(product.stock)} available)` : 
                  '❌ Out of Stock'
                }
              </div>
            </div>
          ))}
        </div>
        
        {productList.items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found. Check your Wix configuration.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Stock Debug Page</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error fetching products:</strong>
          <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }
}