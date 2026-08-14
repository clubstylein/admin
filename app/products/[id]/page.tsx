import Link from "next/link";
import { notFound } from "next/navigation";
import { readItem, readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";

type ProductDetail = {
  id: number;
  item_number: string;
  name: string;
  description?: string | null;
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
    variant_name?: string | null;
    oem_number?: string | null;
    selling_price?: number | string | null;
    cost_price?: number | string | null;
    weight_kg?: number | string | null;
    active?: boolean;
  }>;
};

type FitmentRow = {
  id: number;
  product_variant: number;
  fitment_type?: string | null;
  verified?: boolean;
  requires_modification?: boolean;
  notes?: string | null;
  vehicle?: {
    id: number;
    year: number;
    variant_name?: string | null;
    model_code?: string | null;
    vehicle_model?: {
      id: number;
      name: string;
      vehicle_family?: {
        id: number;
        name: string;
        vehicle_make?: {
          id: number;
          name: string;
        } | null;
      } | null;
    } | null;
  } | null;
};

type SupplierRow = {
  id: number;
  product_variant: number;
  supplier_sku?: string | null;
  supplier_price?: number | string | null;
  moq?: number | null;
  lead_time_days?: number | null;
  preferred_supplier?: boolean;
  supplier?: {
    id: number;
    name: string;
  } | null;
  currency?: {
    id: number;
    name: string;
    value?: string | null;
  } | null;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    notFound();
  }

  let product: ProductDetail;

  try {
    product = (await directus.request(
      readItem("products", productId, {
        fields: [
          "id",
          "item_number",
          "name",
          "description",
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
          "product_variants.variant_name",
          "product_variants.oem_number",
          "product_variants.selling_price",
          "product_variants.cost_price",
          "product_variants.weight_kg",
          "product_variants.active",
        ],
      })
    )) as ProductDetail;
  } catch {
    notFound();
  }

  const variantIds = product.product_variants?.map((v) => v.id) ?? [];

  const fitments =
    variantIds.length > 0
      ? ((await directus.request(
          readItems("fitments", {
            filter: {
              product_variant: {
                _in: variantIds,
              },
            },
            fields: [
              "id",
              "product_variant",
              "fitment_type",
              "verified",
              "requires_modification",
              "notes",

              "vehicle.id",
              "vehicle.year",
              "vehicle.variant_name",
              "vehicle.model_code",

              "vehicle.vehicle_model.id",
              "vehicle.vehicle_model.name",

              "vehicle.vehicle_model.vehicle_family.id",
              "vehicle.vehicle_model.vehicle_family.name",

              "vehicle.vehicle_model.vehicle_family.vehicle_make.id",
              "vehicle.vehicle_model.vehicle_family.vehicle_make.name",
            ],
            limit: -1,
          })
        )) as FitmentRow[])
      : [];

  const supplierProducts =
    variantIds.length > 0
      ? ((await directus.request(
          readItems("supplier_products", {
            filter: {
              product_variant: {
                _in: variantIds,
              },
            },
            fields: [
              "id",
              "product_variant",
              "supplier_sku",
              "supplier_price",
              "moq",
              "lead_time_days",
              "preferred_supplier",

              "supplier.id",
              "supplier.name",

              "currency.id",
              "currency.name",
              "currency.value",
            ],
            limit: -1,
          })
        )) as SupplierRow[])
      : [];

  const category =
    product.product_subtype?.product_type?.product_category?.name ?? "—";

  const type = product.product_subtype?.product_type?.name ?? "—";
  const subtype = product.product_subtype?.name ?? "—";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Products
          </Link>

          <div className="mt-3 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {product.active ? (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                Inactive
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Item #{product.item_number}
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">General</h2>

        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Info label="Brand" value={product.brand?.name ?? "—"} />
          <Info label="Category" value={category} />
          <Info label="Type" value={type} />
          <Info label="Subtype" value={subtype} />
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Description
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {product.description || "No description"}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Variants</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Header>SKU</Header>
                <Header>Variant</Header>
                <Header>OEM #</Header>
                <Header right>Selling Price</Header>
                <Header right>Cost</Header>
                <Header right>Weight</Header>
                <Header>Status</Header>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {product.product_variants?.map((variant) => (
                <tr key={variant.id}>
                  <Cell>{variant.sku}</Cell>
                  <Cell>{variant.variant_name || "—"}</Cell>
                  <Cell>{variant.oem_number || "—"}</Cell>
                  <Cell right>
                    {formatINR(variant.selling_price)}
                  </Cell>
                  <Cell right>{formatINR(variant.cost_price)}</Cell>
                  <Cell right>
                    {variant.weight_kg
                      ? `${Number(variant.weight_kg)} kg`
                      : "—"}
                  </Cell>
                  <Cell>{variant.active === false ? "Inactive" : "Active"}</Cell>
                </tr>
              ))}

              {!product.product_variants?.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No variants.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Vehicle Fitment
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Header>Make</Header>
                <Header>Family</Header>
                <Header>Model</Header>
                <Header>Year</Header>
                <Header>Variant</Header>
                <Header>Fitment</Header>
                <Header>Verified</Header>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {fitments.map((fitment) => (
                <tr key={fitment.id}>
                  <Cell>
                    {fitment.vehicle?.vehicle_model?.vehicle_family?.vehicle_make
                      ?.name ?? "—"}
                  </Cell>
                  <Cell>
                    {fitment.vehicle?.vehicle_model?.vehicle_family?.name ?? "—"}
                  </Cell>
                  <Cell>
                    {fitment.vehicle?.vehicle_model?.name ?? "—"}
                  </Cell>
                  <Cell>{fitment.vehicle?.year ?? "—"}</Cell>
                  <Cell>{fitment.vehicle?.variant_name || "—"}</Cell>
                  <Cell>{fitment.fitment_type || "—"}</Cell>
                  <Cell>{fitment.verified ? "Yes" : "No"}</Cell>
                </tr>
              ))}

              {fitments.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No fitment records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Suppliers</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Header>Supplier</Header>
                <Header>Supplier SKU</Header>
                <Header right>Price</Header>
                <Header right>MOQ</Header>
                <Header right>Lead Time</Header>
                <Header>Preferred</Header>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {supplierProducts.map((row) => (
                <tr key={row.id}>
                  <Cell>{row.supplier?.name ?? "—"}</Cell>
                  <Cell>{row.supplier_sku || "—"}</Cell>
                  <Cell right>
                    {formatSupplierPrice(
                      row.supplier_price,
                      row.currency?.value || row.currency?.name
                    )}
                  </Cell>
                  <Cell right>{row.moq ?? "—"}</Cell>
                  <Cell right>
                    {row.lead_time_days != null
                      ? `${row.lead_time_days} days`
                      : "—"}
                  </Cell>
                  <Cell>{row.preferred_supplier ? "Yes" : "No"}</Cell>
                </tr>
              ))}

              {supplierProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No suppliers linked.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Images</h2>
        <p className="mt-2 text-sm text-gray-500">
          Product image management will be added next.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Shopify</h2>
        <p className="mt-2 text-sm text-gray-500">
          Shopify publication and sync status will be added after the catalog
          editor is complete.
        </p>
      </section>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}

function Header({
  children,
  right = false,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <th
      className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Cell({
  children,
  right = false,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <td
      className={`whitespace-nowrap px-6 py-4 text-sm text-gray-700 ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  );
}

function formatINR(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "—";

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatSupplierPrice(
  value: number | string | null | undefined,
  currency?: string | null
) {
  if (value === null || value === undefined) return "—";

  return `${currency || ""} ${Number(value).toLocaleString("en-IN")}`.trim();
}