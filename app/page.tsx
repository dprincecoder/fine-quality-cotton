/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Filters from "@/components/Filters";
import EmptyState from "@/components/products/EmptyState";
import Product from "@/components/products/Product";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product as ProductType } from "@/db";
import { cn } from "@/lib/utils";
import { ProductState } from "@/lib/validators";
import { useQuery } from "@tanstack/react-query";
import { QueryResult } from "@upstash/vector";
import axios from "axios";
import debounce from "lodash.debounce";

import { ChevronDown, Filter } from "lucide-react";
import { useCallback, useState } from "react";

export interface ISizeFilter {
  id: string;
  name: string;
  options: { label: string; value: string }[];
}
export interface IColorFilter {
  id: string;
  name: string;
  options: ReadonlyArray<{ label: string; value: string }>;
}

export interface IPriceFilter {
  id: string;
  name: string;
  options: {
    label: string;
    value: [number, number];
    isCustom?: boolean;
  }[];
}

const SORT_OPTIONS = [
  { name: "none", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
] as const;
const SUB_CATEGORIES = [
  { name: "T-Shirts", selected: true, href: "#" },
  { name: "Tops", selected: false, href: "#" },
  { name: "Hoodies", selected: false, href: "#" },
  { name: "Accessories", selected: false, href: "#" },
  { name: "Shoes", selected: false, href: "#" },
];
const COLORS: IColorFilter[] = [
  {
    id: "color",
    name: "Color",
    options: [
      { label: "White", value: "white" },
      { label: "Beige", value: "beige" },
      { label: "Blue", value: "blue" },
      { label: "Green", value: "green" },
      { label: "Purple", value: "purple" },
    ] as const,
  },
];

const SIZE_FILTER: ISizeFilter[] = [
  {
    id: "size",
    name: "Size",
    options: [
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
    ],
  },
] as const;

const PRICE_FILTER: IPriceFilter = {
  id: "price",
  name: "Price",
  options: [
    { label: "Any price", value: [0, 100] },
    { label: "Under $25", value: [0, 25] },
    { label: "$25 to $50", value: [25, 50] },
  ],
} as const;

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

export default function Home() {
  const [filters, setFilters] = useState<ProductState>({
    sort: "none",
    color: ["beige", "blue", "green", "purple", "white"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["S", "M", "L"],
  });

  const { data: products, refetch } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<ProductType>[]>(
        "http://localhost:3000/api/products",
        {
          filter: {
            sort: filters.sort,
            color: filters.color,
            price: filters.price.range,
            size: filters.size,
          },
        }
      );
      return data;
    },
  });

  const onSubmit = () => refetch();

  const debounceSubmit = debounce(onSubmit, 1000);
  const _debounceSubmit = useCallback(debounceSubmit, []);

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filters, "price" | "sort">;
    value: string;
  }) => {
    //   setFilters((prev) => {
    //     const prevArray = prev[category] as string[];
    //     const exists = prevArray.includes(value);
    //     return {
    //       ...prev,
    //       [category]: exists
    //         ? prevArray.filters((val) => val !== value)
    //         : [...prevArray, value],
    //     };
    //   });
    // }
    const isFilterApplied = filters[category].includes(value as never);
    if (isFilterApplied) {
      setFilters((prev) => ({
        ...prev,
        [category]: prev[category].filter((val) => val !== value),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }
    _debounceSubmit();
  };
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Fine Qaulity cottons
        </h1>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flexx justify-center text-sm font-medium text-gray-700 hover:text-gray-800">
              Sort{" "}
              <ChevronDown className="w-5 h-5 ml-2 text-gray-400 flex-shrink-0group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-10">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-900 bg-gray-100": option.value === filters.sort,
                    "text-gray-500": option.value !== filters.sort,
                  })}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      sort: option.value,
                    }));
                    _debounceSubmit();
                  }}
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* filters */}
          <Filters
            categories={SUB_CATEGORIES}
            colors={COLORS}
            onFilterChange={(category: "color" | "size", value) =>
              applyArrayFilter({ category, value })
            }
            filters={filters}
            setFilters={setFilters}
            sizeFilter={SIZE_FILTER}
            priceFilter={PRICE_FILTER}
            defaultCustomPrice={DEFAULT_CUSTOM_PRICE}
            onSubmit={_debounceSubmit}
          />

          {/* products */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products?.length === 0 ? (
              <EmptyState />
            ) : (products?.length ?? 0) > 0 ? (
              <>
                {products?.map((product) => (
                  <Product key={product.id} product={product.metadata!} />
                ))}
              </>
            ) : (
              new Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
