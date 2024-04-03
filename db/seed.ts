import * as dotenv from "dotenv";
import { DB, Product } from ".";

dotenv.config();

const getRandPrice = () => {
  const PRICES = [9.99, 19.99, 39.99, 49.99];
  return PRICES[Math.floor(Math.random() * PRICES.length)];
};
const COLORS = ["white", "beige", "blue", "green", "purple"] as const;
const SIZES = ["S", "M", "L"] as const;
const seed = async () => {
  const products: Product[] = [];

  // 3 product example
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < COLORS.length; j++) {
      for (let k = 0; k < SIZES.length; k++) {
        const size = SIZES[k];
        const color = COLORS[j];
        products.push({
          id: `${color}-${size}-${i + 1}`,
          imageId: `/${color}_${i + 1}.png`,
          color,
          name: `${
            color.slice(0, 1).toUpperCase() + color.slice(1)
          } shirt ${i}`,
          size,
          price: getRandPrice(),
        });
      }
    }
  }

  const SIZE_MAP = {
    S: 0,
    M: 1,
    L: 2,
  };

  const COLOR_MAP = {
    white: 0,
    beige: 1,
    blue: 2,
    green: 3,
    purple: 4,
  };

  await DB.upsert(
    products.map((prod) => ({
      id: prod.id,
      vector: [COLOR_MAP[prod.color], SIZE_MAP[prod.size], prod.price],
      metadata: prod,
    }))
  );
};

seed();
