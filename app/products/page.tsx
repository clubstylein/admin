import Link from "next/link";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";

type Product = {
  id: number;
  item_number?: string;
  name?: string;
  active?: boolean;
};

export default async function ProductsPage() {
  const products = await directus.request(
    readItems("products", {
      fields: ["id", "item_number", "name", "active"],
      limit: 100,
    })
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-gray-500">
            Manage the ClubStyle product catalog.
          </p>
        </div>

        <Link
          href="/products/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-medium">
                Item #
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium">
                Product
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {(products as Product[]).map((product) => (
              <tr
                key={product.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-5 py-4 text-sm">
                  {product.item_number}
                </td>

                <td className="px-5 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      product.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-12 text-center text-gray-400"
                >
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}