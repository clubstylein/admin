import Link from "next/link";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import { createProduct } from "./actions";

type Brand = {
  id: number;
  name: string;
};

type ProductSubtype = {
  id: number;
  name: string;
};

export default async function NewProductPage() {
  const [brands, subtypes] = await Promise.all([
    directus.request(
      readItems("product_brands", {
        fields: ["id", "name"],
        filter: {
          active: {
            _eq: true,
          },
        },
        sort: ["name"],
        limit: -1,
      })
    ),

    directus.request(
      readItems("product_subtypes", {
        fields: ["id", "name"],
        filter: {
          active: {
            _eq: true,
          },
        },
        sort: ["name"],
        limit: -1,
      })
    ),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link
          href="/products"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Products
        </Link>

        <h1 className="mt-3 text-3xl font-bold">Add Product</h1>

        <p className="mt-1 text-gray-500">
          Create a new ClubStyle product.
        </p>
      </div>

      <form action={createProduct} className="space-y-6">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Item Number */}
            <div>
              <label
                htmlFor="item_number"
                className="mb-2 block text-sm font-medium"
              >
                Item Number
              </label>

              <input
                id="item_number"
                name="item_number"
                type="text"
                required
                placeholder="0218473629"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
              />
            </div>

            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Black Oil Filter"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
              />
            </div>

            {/* Brand */}
            <div>
              <label
                htmlFor="product_brand"
                className="mb-2 block text-sm font-medium"
              >
                Brand
              </label>

              <select
                id="product_brand"
                name="product_brand"
                className="w-full rounded-lg border bg-white px-3 py-2"
                defaultValue=""
              >
                <option value="">
                  Select brand
                </option>

                {(brands as Brand[]).map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Subtype */}
            <div>
              <label
                htmlFor="product_subtype"
                className="mb-2 block text-sm font-medium"
              >
                Product Subtype
              </label>

              <select
                id="product_subtype"
                name="product_subtype"
                className="w-full rounded-lg border bg-white px-3 py-2"
                defaultValue=""
              >
                <option value="">
                  Select subtype
                </option>

                {(subtypes as ProductSubtype[]).map((subtype) => (
                  <option key={subtype.id} value={subtype.id}>
                    {subtype.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Description */}
          <div className="mt-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Product description..."
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
            />
          </div>

          {/* Active */}
          <div className="mt-6 flex items-center gap-3">
            <input
              id="active"
              name="active"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <label
              htmlFor="active"
              className="text-sm font-medium"
            >
              Active
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/products"
            className="rounded-lg border bg-white px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}