"use server";

import { createItem } from "@directus/sdk";
import { redirect } from "next/navigation";
import { directus } from "@/lib/directus";

export async function createProduct(formData: FormData) {
  const itemNumber = String(formData.get("item_number") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const productBrand = Number(formData.get("product_brand"));
  const productSubtype = Number(formData.get("product_subtype"));
  const description = String(formData.get("description") || "").trim();
  const active = formData.get("active") === "on";

  if (!itemNumber || !name) {
    throw new Error("Item Number and Product Name are required.");
  }

  await directus.request(
    createItem("products", {
      item_number: itemNumber,
      name,
      product_brand: productBrand || null,
      product_subtype: productSubtype || null,
      description,
      active,
      archived: false,
    })
  );

  redirect("/products");
}