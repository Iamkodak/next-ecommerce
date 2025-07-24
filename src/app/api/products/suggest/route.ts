import { NextRequest, NextResponse } from 'next/server';

// Replace with your actual Wix Headless API endpoint and credentials
const WIX_API_URL = 'https://www.wixapis.com/stores/v1/products/query';
const WIX_API_KEY = process.env.WIX_API_KEY || '';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  // Wix Headless API expects a POST request with a filter
  const wixResponse = await fetch(WIX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': WIX_API_KEY,
    },
    body: JSON.stringify({
      filter: {
        name: {
          $startsWith: query
        }
      },
      paging: {
        limit: 10
      },
      fields: ['_id', 'name']
    }),
  });

  if (!wixResponse.ok) {
    return NextResponse.json({ products: [] }, { status: 500 });
  }

  const data = await wixResponse.json();
  // Adapt the response to the frontend format
  const products = (data.products || []).map((p: any) => ({
    id: p._id,
    name: p.name,
  }));

  return NextResponse.json({ products });
}
