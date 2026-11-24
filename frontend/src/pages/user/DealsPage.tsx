import React from "react";
import ProductGrid from "../../components/ProductsGrid";
import { type Product } from "../../types";
import { productApis } from "../../services/products";

const DealsPage: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const pageSize = 10;

  // Fetch paginated deals
  React.useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);

        const data = await productApis.getDeals(currentPage, pageSize);

        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (err) {
        console.log("Error fetching deals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [currentPage]);
  

  return (
    <div className="m-auto max-w-[90%] py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Latest Deals</h1>

      {isLoading ? (
        <p className="py-10 text-center text-gray-500">Loading deals...</p>
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No deals available.</p>
      ) : (
        <>
          <ProductGrid products={products} />

          {/* Pagination */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Showing {currentPage * pageSize + 1} to{" "}
              {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
              {totalElements} products
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 0 || isLoading}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= totalPages - 1 || isLoading}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DealsPage;
