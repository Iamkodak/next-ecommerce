"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const diagnosticPages = [
  { href: "/quick-test", label: "Quick Test", description: "Basic API connection test" },
  { href: "/api-test", label: "API Test", description: "Detailed API response analysis" },
  { href: "/debug-stock", label: "Debug Stock", description: "Enhanced stock debugging with recommendations" },
  { href: "/stock-diagnostic", label: "Stock Diagnostic", description: "Comprehensive stock analysis tool" },
  { href: "/test-stock", label: "Test Stock", description: "Simple stock test interface" },
];

export default function DiagnosticNav() {
  const pathname = usePathname();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-800 mb-3">🔧 Stock Diagnostic Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {diagnosticPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className={`block p-3 rounded border transition-colors ${
              pathname === page.href
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
            }`}
          >
            <div className="font-medium text-sm">{page.label}</div>
            <div className="text-xs text-gray-600 mt-1">{page.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}