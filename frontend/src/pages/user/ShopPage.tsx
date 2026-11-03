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

const ShopPage = () => {
  const [categoryIds, setCategoryIds] = React.useState<Set<number>>(new Set());
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
  // Assuming categories and attributes are fetched in ShopPage

  const handleSelectCategories = (id: number) => {
    setCategoryIds((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const toggleAttributeValue = (id: number) => {
    setAttributeValueIds((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const resetFilters = () => {
    setCategoryIds(new Set());
    setMinPrice("");
    setMaxPrice("");
    setInStock("");
    setMinRating("");
    setAttributeValueIds(new Set());
  };

  const applyFilters = () => {
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
        minRating: minRating ? Number(minRating) : undefined,
      })
      .then((data) => {
        setProducts(data);
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
  ]);
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
              {products.length} products
            </span>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </div>
  );
};

export default ShopPage;
