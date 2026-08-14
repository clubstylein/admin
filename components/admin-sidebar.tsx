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

const sections = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Catalog",
    items: [
      { name: "Products", href: "/products", icon: Package },
      { name: "Brands", href: "/brands", icon: Tags },
      { name: "Vehicles & Fitment", href: "/vehicles", icon: Bike },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Inventory", href: "/inventory", icon: Boxes },
      { name: "Purchasing", href: "/purchasing", icon: ShoppingCart },
      { name: "Sales", href: "/sales", icon: ShoppingBag },
      { name: "Shipping", href: "/shipping", icon: Truck },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Shopify", href: "/shopify", icon: ShoppingBag },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white p-4">
      <div className="mb-8">
        <div className="text-xl font-bold">ClubStyle</div>
        <div className="text-sm text-gray-500">Back Office</div>
      </div>

      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {section.title}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}