"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  ShoppingBag,
  Settings,
  Tags,
  Bike,
} from "lucide-react";

const items = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Brands", href: "/brands", icon: Tags },
  { name: "Vehicles & Fitment", href: "/vehicles", icon: Bike },
  { name: "Inventory", href: "/inventory", icon: Boxes },
  { name: "Purchasing", href: "/purchasing", icon: ShoppingCart },
  { name: "Sales", href: "/sales", icon: ShoppingBag },
  { name: "Shipping", href: "/shipping", icon: Truck },
  { name: "Shopify", href: "/shopify", icon: ShoppingBag },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AdminNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="mr-8 min-w-fit">
          <div className="text-lg font-bold">ClubStyle</div>
          <div className="text-xs text-gray-500">Back Office</div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}