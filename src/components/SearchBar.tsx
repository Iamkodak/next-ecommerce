"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced fetch for suggestions
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetch(`/api/products/suggest?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.products || []))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      router.push(`/list?name=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    router.push(`/list?name=${encodeURIComponent(name)}`);
  };

  // Hide suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-fit">
      <form
        className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md "
        onSubmit={handleSearch}
        autoComplete="off"
      >
        <input
          ref={inputRef}
          type="text"
          name="name"
          placeholder="Search"
          className="w-[450px] bg-transparent outline-none"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
        />
        <button type="submit" className="cursor-pointer">
          <Search />
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <li
              key={product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(product.name)}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
