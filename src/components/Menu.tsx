"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Menuu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Menu
        className="w-[28px] h-[28px] cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10">
          <Link href="">Homepage</Link>
          <Link href="">Shop</Link>
          <Link href="">Deals</Link>
          <Link href="">About</Link>
          <Link href="">Contact Us</Link>
          <Link href="">LogOut</Link>
          <Link href="">Cart(1)</Link>
        </div>
      )}
    </div>
  );
}
