import React from "react";
import {
  type Category,
  type Product,
  type ProductAttribute,
} from "../../types";
import { attributesApi } from "../../services/attributes";
import { productApis } from "../../services/products";
import { AlertCircle, CheckCircle, Edit, Package, Plus } from "lucide-react";
import { formatPrice, getDiscountedPrice } from "../../utils/helperFunctions";
import { categoriesApi } from "../../services/category";
import CategoryTreeFilter from "../../components/ui/CategoryTreeFilter";
import { Link } from "react-router";
import ProductEditModal from "../../components/ProductEditModal";

const ProductsPage: React.FC = () => {
  const [attributes, setAttributes] = React.useState<ProductAttribute[]>([]);
  const [products, setProducts] = React.useState<Product[]>();

  const [categories, setCategories] = React.useState<Category[]>([]);

  const [attributesLoading, setAttributesLoading] =
    React.useState<boolean>(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null,
  );
  //For pagination
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [productsLoading, setProductsLoading] = React.useState(false);
  //For filters
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [attributeValueIds, setAttributeValueIds] = React.useState<Set<number>>(
    new Set(),
  );
  const [categoryIds, setCategoryIds] = React.useState<Set<number>>(new Set());
  const [inStock, setInStock] = React.useState("");
  const [stockMin, setStockMin] = React.useState("");
  const [stockMax, setStockMax] = React.useState("");
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [minRating, setMinRating] = React.useState("");
  //Fetch all attributes
  React.useEffect(() => {
    attributesApi
      .getAll()
      .then((data) => setAttributes(data))
      .catch((err) => console.log("err", err))
      .finally(() => setAttributesLoading(false));
  }, []);

  //Fetch all products
  React.useEffect(() => {
    productApis
      .getAll({
        keyword: searchKeyword.trim() || undefined,
        categoryIds: categoryIds.size > 0 ? Array.from(categoryIds) : undefined,
        attributeValueIds:
          attributeValueIds.size > 0
            ? Array.from(attributeValueIds)
            : undefined,
        inStock: inStock === "" ? undefined : inStock === "true",
        stockMin: stockMin ? Number(stockMin) : undefined,
        stockMax: stockMax ? Number(stockMax) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        page,
        size: pageSize,
      })
      .then((data) => {

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
    stockMin,
    stockMax,
    minPrice,
    maxPrice,
    minRating,
    page,
    pageSize,
  ]);
  //Fetch all categories
  React.useEffect(() => {
    categoriesApi
      .getAll()
      .then((data) => setCategories(data))
      .catch((err) => {
        console.log("err fetching categories", err);
      });
  }, []);

  //Select category filter
  const handleSelectCategories = (id: number): void => {
    setPage(0);
    setCategoryIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };
  //Toggle attribute filter
  const toggleAttributeValue = (valueId: number) => {
    setPage(0);
    setAttributeValueIds((current) => {
      const next = new Set(current);

      if (next.has(valueId)) {
        next.delete(valueId);
      } else {
        next.add(valueId);
      }

      return next;
    });
  };

  //handle edit product modal open
  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  //handle product updated
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((current) =>
      current?.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );

    setEditingProduct(null);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Products
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            All products currently available in the catalog.
          </p>
        </div>
        <Link
          to={"/admin/products/create"}
          // onClick={() => setFilterRefreshKey((key) => key + 1)}
          className="rounded-lg flex justify-center items-center bg-primary p-2 w-fit h-fit text-center text-xs font-medium text-white"
        >
          Add Product
          <Plus size={14} />
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            Product Filters
          </h2>
          <button
            type="button"
            // onClick={() => setFilterRefreshKey((key) => key + 1)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white"
          >
            Apply filters
          </button>
          <button
            type="button"
            // onClick={resetFilters}
            className="text-xs font-medium text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
        <div className="grid grid-cols-1  gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input
            value={searchKeyword}
            onChange={(event) => {
              setPage(0);
              setSearchKeyword(event.target.value);
            }}
            placeholder="Search products..."
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          />
          <div className="min-w-0">
            <CategoryTreeFilter
              categories={categories}
              selectedIds={categoryIds}
              onChange={handleSelectCategories}
            />
          </div>
          <select
            value={inStock}
            onChange={(event) => setInStock(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          >
            <option value="">Any stock status</option>
            <option value="true">In stock</option>
            <option value="false">Out of stock</option>
          </select>
          <select
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          >
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ stars</option>
          </select>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Minimum price"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Maximum price"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          />
          <input
            type="number"
            min="0"
            value={stockMin}
            onChange={(event) => setStockMin(event.target.value)}
            placeholder="Minimum stock"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          />
          <input
            type="number"
            min="0"
            value={stockMax}
            onChange={(event) => setStockMax(event.target.value)}
            placeholder="Maximum stock"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          />
        </div>
        {attributes.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 md:grid-cols-2 lg:grid-cols-3">
            {attributes.map((attribute) => (
              <fieldset key={attribute.id}>
                <legend className="mb-2 text-xs font-semibold text-text-secondary">
                  {attribute.name}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(attribute.values).map(([id, value]) => (
                    <label
                      key={id}
                      className="inline-flex items-center gap-1.5 text-xs text-text-secondary"
                    >
                      <input
                        type="checkbox"
                        checked={attributeValueIds.has(Number(id))}
                        onChange={() => toggleAttributeValue(Number(id))}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        )}
      </div>
      {/* All products */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-alt text-xs font-semibold uppercase text-text-secondary">
            <tr>
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Category</th>

              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Discount</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-muted">
                  <Package className="mx-auto mb-2 h-10 w-10 text-text-muted/60" />
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const isOutOfStock = product.stockQuantity === 0;
                const isLowStock =
                  product.stockQuantity > 0 && product.stockQuantity <= 15;

                return (
                  <tr
                    key={product.id}
                    className={`transition hover:bg-surface-hover ${
                      index % 2 === 1 ? "bg-surface-alt/40" : ""
                    }`}
                  >
                    {/* Product */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.imageUrls[0] ? (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="h-12 w-12 flex-shrink-0 rounded-lg border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-surface-alt">
                            <Package className="h-5 w-5 text-text-muted" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="max-w-xs truncate font-medium text-text-primary">
                            {product.name}
                          </p>
                          <p className="max-w-xs truncate text-xs text-text-muted">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-text-secondary">
                      {product.categoryName || "General"}
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="font-semibold text-text-primary">
                        {formatPrice(
                          getDiscountedPrice(
                            product.mrpPrice,
                            product.discount,
                          ),
                        )}
                      </div>

                      {product.discount > 0 && (
                        <div className="text-xs text-text-muted line-through">
                          {formatPrice(product.mrpPrice)}
                        </div>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {product.discount > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {product.discount}% OFF
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">
                          No discount
                        </span>
                      )}
                    </td>
                    {/* Stock */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-text-secondary">
                      {product.stockQuantity} units
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                          <AlertCircle className="h-3 w-3" />
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <AlertCircle className="h-3 w-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle className="h-3 w-3" />
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openEditProduct(product)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:bg-surface-hover hover:text-primary"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Results information */}
        <p className="text-sm text-text-secondary">
          Showing{" "}
          <span className="font-semibold text-text-primary">
            {totalElements === 0 ? 0 : page * pageSize + 1}
          </span>
          {" - "}
          <span className="font-semibold text-text-primary">
            {Math.min((page + 1) * pageSize, totalElements)}
          </span>
          {" of "}
          <span className="font-semibold text-text-primary">
            {totalElements}
          </span>
          {" products"}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Page size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Rows per page</span>

            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(0);
              }}
              className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-text-primary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Previous */}
          <button
            type="button"
            disabled={page === 0 || productsLoading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-primary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {/* Current page */}
          <span className="text-sm text-text-secondary">
            Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          </span>

          {/* Next */}
          <button
            type="button"
            disabled={page >= totalPages - 1 || productsLoading}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-primary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
      {/* Edit product modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          categories={categories}
          attributes={attributes}
          onClose={() => setEditingProduct(null)}
          onSave={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default ProductsPage;
