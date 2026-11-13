import React from "react";
import ShopFilters from "../../components/ShopFilters";
import {
  type ProductAttribute,
  type Category,
  type Product,
} from "../../types";
import { attributesApi } from "../../services/attributes";
import { categoriesApi } from "../../services/category";
import { productApis } from "../../services/products";
import ProductGrid from "../../components/ProductsGrid";
import { Search } from "lucide-react";
import { useLocation } from "react-router";
const PAGE_SIZE = 12;
const ShopPage = () => {
  const location = useLocation();
  const data = location.state;

  const [categoryIds, setCategoryIds] = React.useState<Set<number>>(
    new Set(data?.categoryId ? [data.categoryId] : []),
  );
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [inStock, setInStock] = React.useState("");
  const [minRating, setMinRating] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [attributeValueIds, setAttributeValueIds] = React.useState<Set<number>>(
    new Set(),
  );
  const [attributes, setAttributes] = React.useState<ProductAttribute[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  // Pagination
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  // Assuming categories and attributes are fetched in ShopPage

  const handleSelectCategories = (id: number) => {
    setPage(0);
    setCategoryIds((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const toggleAttributeValue = (id: number) => {
    setPage(0);
    setAttributeValueIds((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const resetFilters = () => {
    setPage(0);
    setCategoryIds(new Set());
    setMinPrice("");
    setMaxPrice("");
    setInStock("");
    setMinRating("");
    setAttributeValueIds(new Set());
  };

  const applyFilters = () => {
    setPage(0);
    // Call your product API here using the selected filter values.
  };

  //Fetch all attributes
  React.useEffect(() => {
    attributesApi
      .getAll()
      .then((data) => setAttributes(data))
      .catch((err) => console.log("err", err));
    //   .finally(() => setIsLoading(false));
  }, []);

  //Load categories
  React.useEffect(() => {
    categoriesApi
      .getAll()
      .then((data) => setCategories(data))
      .catch((err) => console.log("err fetching categories"));
  }, []);

  //fetch products
  React.useEffect(() => {
    productApis
      .getAll({
        keyword: searchKeyword,
        categoryIds: categoryIds.size > 0 ? Array.from(categoryIds) : undefined,
        attributeValueIds:
          attributeValueIds.size > 0
            ? Array.from(attributeValueIds)
            : undefined,
        inStock: inStock === "" ? undefined : inStock === "true",
        stockMin: undefined,
        stockMax: undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page,
        size: PAGE_SIZE,
        minRating: minRating ? Number(minRating) : undefined,
      })
      .then((data) => {
        console.log("data", data);

        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      })
      .catch((err) => {
        console.log("err fetching products", err);
      });
  }, [
    searchKeyword,
    categoryIds,
    attributeValueIds,
    inStock,
    minPrice,
    maxPrice,
    minRating,
    page,
  ]);
  // Generate a maximum of 5 page buttons
  const pageNumbers = React.useMemo(() => {
    const start = Math.max(0, Math.min(page - 2, totalPages - 5));

    return Array.from(
      { length: Math.min(5, totalPages) },
      (_, index) => start + index,
    );
  }, [page, totalPages]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative mx-auto max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search for products..."
            className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Filters + Products */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Filters */}
        <aside>
          <ShopFilters
            categories={categories}
            categoryIds={categoryIds}
            handleSelectCategories={handleSelectCategories}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStock={inStock}
            setInStock={setInStock}
            minRating={minRating}
            setMinRating={setMinRating}
            attributes={attributes}
            attributeValueIds={attributeValueIds}
            toggleAttributeValue={toggleAttributeValue}
            onApply={applyFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* Products */}
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-text-primary">
              Shop Products
            </h1>

            <span className="text-sm text-text-muted">
              {totalElements} products
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-text-secondary">
              Loading products...
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductGrid products={products} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary transition hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-medium transition ${
                        page === pageNumber
                          ? "border-primary bg-primary text-white"
                          : "border-border text-text-primary hover:bg-surface-alt"
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary transition hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Results information */}
              <p className="mt-4 text-center text-xs text-text-muted">
                Showing {page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, totalElements)} of{" "}
                {totalElements} products
              </p>
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-text-primary">
                No products found
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ShopPage;
