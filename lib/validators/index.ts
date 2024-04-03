import { z } from "zod";

export const AVAILABLE_SIZE = ["S", "M", "L"] as const;
export const AVAILABLE_COLORS = [
  "white",
  "beige",
  "green",
  "purple",
  "blue",
] as const;
export const AVAILABLE_SORT = [
  "none",
  "price-asc",
  "price-desc",
  "newest",
  "oldest",
] as const;
export const ProductFilterValidators = z.object({
  sort: z.enum(AVAILABLE_SORT),
  color: z.array(z.enum(AVAILABLE_COLORS)),
  price: z.tuple([z.number(), z.number()]),
  size: z.array(z.enum(AVAILABLE_SIZE)),
});

export type ProductState = Omit<
  z.infer<typeof ProductFilterValidators>,
  "price"
> & {
  price: { isCustom: boolean; range: [number, number] };
};
