import { XCircle } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="relative col-span-full h-80 bg-gray-50 w-full p-12 flex flex-col items-center justify-center">
      <XCircle className="w-8 h-8 text-red-500" />
      <h3 className="font-semibold text-xl">No products found</h3>
      <p className="text-zinc-500 text-sm">
        We couldn&apos;t find any products matching your criteria.
      </p>
    </div>
  );
};

export default EmptyState;
