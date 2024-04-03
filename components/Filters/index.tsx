import { IColorFilter, IPriceFilter, ISizeFilter } from "@/app/page";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Fragment } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Slider } from "../ui/slider";

type FilterProps = {
  categories: Array<{ name: string; selected: boolean; href: string }>;
  colors: IColorFilter[];
  sizeFilter: ISizeFilter[];
  priceFilter: IPriceFilter;
  onFilterChange: (category: "color" | "size", value: string) => void;
  filters: {
    color: string[];
    size: string[];
    price: { isCustom: boolean; range: [number, number] };
  };
  setFilters: any;
  defaultCustomPrice: [number, number];
  onSubmit: any;
};

const Filters = ({
  categories,
  colors,
  onFilterChange,
  filters,
  setFilters,
  priceFilter,
  sizeFilter,
  defaultCustomPrice,
  onSubmit,
}: FilterProps) => {
  const min_price = Math.min(filters.price.range[0], filters.price.range[1]);
  const max_price = Math.max(filters.price.range[0], filters.price.range[1]);
  return (
    <div className="hidden lg:block">
      <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
        {categories.map((category) => (
          <li key={category.name} className="flex items-center justify-between">
            <a
              href={category.href}
              className={`${
                category.selected ? "text-gray-900" : "text-gray-500"
              } hover:text-gray-900`}
            >
              {category.name}
            </a>
            <Check
              color="currentColor"
              className={`${
                category.selected ? "text-green-600" : "hidden"
              } w-4 h-4 rounded-full`}
            />
          </li>
        ))}
      </ul>

      <Accordion type="multiple" className="animate-none">
        <AccordionItem value="color">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Color</span>
          </AccordionTrigger>
          <AccordionContent className="pt-6 animate-none">
            <ul className="space-y-4">
              {colors.map((color) => (
                <Fragment key={color.id}>
                  {color.options.map((option, idx) => (
                    <li key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={() => onFilterChange("color", option.value)}
                        id={`color-${idx}`}
                        className="h-4 w-4 mr-2 rounded border-gray-300 text=indigo-600 focus:ring-indigo-500"
                        checked={filters.color.includes(option.value)}
                      />
                      <label
                        htmlFor={`color-${idx}`}
                        className="text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* size */}
        <AccordionItem value="size">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Size</span>
          </AccordionTrigger>
          <AccordionContent className="pt-6 animate-none">
            <ul className="space-y-4">
              {sizeFilter.map((size) => (
                <Fragment key={size.id}>
                  {size.options.map((option, idx) => (
                    <li key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={() => onFilterChange("size", option.value)}
                        id={`size-${idx}`}
                        className="h-4 w-4 mr-2 rounded border-gray-300 text=indigo-600 focus:ring-indigo-500"
                        checked={filters.size.includes(option.value)}
                      />
                      <label
                        htmlFor={`size-${idx}`}
                        className="text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* price */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Price</span>
          </AccordionTrigger>
          <AccordionContent className="pt-6 animate-none">
            <ul className="space-y-4">
              {priceFilter.options.map((option, idx) => (
                <li key={option.label} className="flex items-center">
                  <input
                    type="radio"
                    onChange={() => {
                      setFilters((prev: any) => ({
                        ...prev,
                        price: {
                          isCustom: false,
                          range: [...option.value],
                        },
                      }));
                      onSubmit();
                    }}
                    id={`price-${idx}`}
                    className="h-4 w-4 mr-2 rounded border-gray-300 text=indigo-600 focus:ring-indigo-500"
                    checked={
                      filters.price.isCustom
                        ? false
                        : filters.price.range[0] === option.value[0] &&
                          filters.price.range[1] === option.value[1]
                    }
                  />
                  <label
                    htmlFor={`price-${idx}`}
                    className="text-sm text-gray-600"
                  >
                    {option.label}
                  </label>
                </li>
              ))}
              <li className="flex justify-center flex-col gap-2">
                <div>
                  <input
                    type="radio"
                    onChange={() => {
                      setFilters((prev: any) => ({
                        ...prev,
                        price: {
                          isCustom: true,
                          range: [0, 100],
                        },
                      }));
                      onSubmit();
                    }}
                    id={`price-${priceFilter.options.length}`}
                    className="h-4 w-4 mr-2 rounded border-gray-300 text=indigo-600 focus:ring-indigo-500"
                    checked={filters.price.isCustom}
                  />
                  <label
                    htmlFor={`price-${priceFilter.options.length}`}
                    className="text-sm text-gray-600"
                  >
                    Select price manually
                  </label>
                </div>

                <div className="flex justify-between">
                  <p className="font-medium">Price</p>
                  <div>
                    $
                    {filters.price.isCustom
                      ? min_price.toFixed(0)
                      : filters.price.range[0].toFixed(0)}{" "}
                    - $
                    {filters.price.isCustom
                      ? max_price.toFixed(0)
                      : filters.price.range[1].toFixed(0)}{" "}
                  </div>
                </div>

                <Slider
                  className={cn({ "opacity-50": !filters.price.isCustom })}
                  value={
                    filters.price.isCustom
                      ? filters.price.range
                      : defaultCustomPrice
                  }
                  min={defaultCustomPrice[0]}
                  defaultValue={defaultCustomPrice}
                  max={defaultCustomPrice[1]}
                  step={5}
                  onValueChange={(range) => {
                    const [mewMin, newMax] = range;
                    setFilters((prev: any) => ({
                      ...prev,
                      price: { isCustom: true, range: [mewMin, newMax] },
                    }));
                    onSubmit();
                  }}
                  disabled={!filters.price.isCustom}
                />
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filters;
