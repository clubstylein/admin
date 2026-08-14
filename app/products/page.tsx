import Link from "next/link";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";

type ProductRow = {
  id: number;
  item_number: string;
  name: string;
  active: boolean;
brand?: {
  id: number;
  name: string;
} | null;
  product_subtype?: {
    id: number;
    name: string;
    product_type?: {
      id: number;
      name: string;
      product_category?: {
        id: number;
        name: string;
      } | null;
    } | null;
  } | null;
  product_variants?: Array<{
    id: number;
    sku: string;
    selling_price: number | string | null;
  }>;
};

export default async function ProductsPage() {
  const products = (await directus.request(
    readItems("products", {
      fields: [
        "id",
        "item_number",
        "name",
        "active",

"brand.id",
"brand.name",

        "product_subtype.id",
        "product_subtype.name",

        "product_subtype.product_type.id",
        "product_subtype.product_type.name",

        "product_subtype.product_type.product_category.id",
        "product_subtype.product_type.product_category.name",

        "product_variants.id",
        "product_variants.sku",
        "product_variants.selling_price",
      ],
      sort: ["item_number"],
      limit: -1,
    })
  )) as ProductRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage ClubStyle product catalog and SKUs.
          </p>
        </div>

        <Link
          href="/products/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Item #
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Product
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Brand
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Category
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  SKU
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Price
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {products.map((product) => {
                const firstVariant = product.product_variants?.[0];

                const price =
                  firstVariant?.selling_price !== null &&
                  firstVariant?.selling_price !== undefined
                    ? Number(firstVariant.selling_price)
                    : null;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
                      {product.item_number}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-1 text-xs text-gray-400">
                        ID {product.id}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {product.brand?.name ?? "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {product.product_subtype?.product_type?.product_category
                        ?.name ?? "—"}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div>
                        {product.product_subtype?.product_type?.name ?? "—"}
                      </div>

                      {product.product_subtype?.name && (
                        <div className="mt-1 text-xs text-gray-400">
                          {product.product_subtype.name}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {firstVariant?.sku ?? "—"}

                      {(product.product_variants?.length ?? 0) > 1 && (
                        <div className="mt-1 text-xs text-gray-400">
                          +{product.product_variants!.length - 1} variants
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium text-gray-900">
                      {price !== null
                        ? `₹${price.toLocaleString("en-IN")}`
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {product.active ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}