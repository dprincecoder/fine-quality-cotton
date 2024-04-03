import { DB } from "@/db";
import { ProductFilterValidators } from "@/lib/validators";
import { NextRequest } from "next/server";

class Filter {
  private filters: Map<string, string[]> = new Map();

  // check if theere is a filter
  hasFilter() {
    return this.filters.size > 0;
  }

  // add filter
  add(key: string, operator: string, value: string | number) {
    const filter = this.filters.get(key) || [];

    // add filter checking if the key is number then add it else the key is string for color as example then wrap it with double quotes
    filter.push(
      `${key} ${operator} ${typeof value === "number" ? value : `"${value}"`}`
    );
    this.filters.set(key, filter);
  }

  // add any raw filters if needed
  addRaw(key: string, rawFilter: string) {
    this.filters.set(key, [rawFilter]);
  }

  // get filters
  get() {
    const parts: string[] = [];
    this.filters.forEach((filter) => {
      const groupedValues = filter.join(" OR ");
      parts.push(`(${groupedValues})`);
    });
    return parts.join(" AND ");
  }
}

const AVG_PRODUCT_PRICE = 25 as const;
const MAX_PRODUC_PRICE = 50 as const;

export const POST = async (reqst: NextRequest) => {
  try {
    const body = await reqst.json();
    const { color, price, size, sort } = ProductFilterValidators.parse(
      body.filter
    );

    const filter = new Filter();

    if (color.length > 0)
      color.forEach((color) => filter.add("color", "=", color));
    else filter.addRaw("color", `color =  ""`);

    if (size.length > 0) size.forEach((size) => filter.add("size", "=", size));
    else filter.addRaw("size", `size =  ""`);
    filter.addRaw("price", `price >= ${price[0]} AND price <= ${price[1]}`);

    const products = await DB.query({
      topK: 12,
      vector: [
        0,
        0,
        sort === "none"
          ? AVG_PRODUCT_PRICE
          : sort === "price-asc"
          ? 0
          : MAX_PRODUC_PRICE,
      ],
      includeMetadata: true,
      filter: filter.hasFilter() ? filter.get() : undefined,
    });

    return new Response(JSON.stringify(products));
  } catch (error: unknown) {
    return new Response((error as Error).message, { status: 500 });
  }
};
