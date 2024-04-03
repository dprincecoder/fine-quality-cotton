const ProductSkeleton = () => {
  return (
    <div className="relative animate-pulse">
      <div className="aspect-sqaure w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <div className="h-full w-full bg-gray-300" />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="w-1/2">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2 mt-2" />
          <div className="h-4 bg-gray-300 rounded w-1/4 mt-2" />
        </div>
        <div className="w-1/4">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
