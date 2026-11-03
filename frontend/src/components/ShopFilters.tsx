import React from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import CategoryTreeFilter from "./ui/CategoryTreeFilter";
import {type Category, type ProductAttribute } from "../types";

interface ShopFiltersProps {
  categories: Category[];
  categoryIds: Set<number>;
  handleSelectCategories: (id: number) => void;

  minPrice: string;
  setMinPrice: (value: string) => void;

  maxPrice: string;
  setMaxPrice: (value: string) => void;

  inStock: string;
  setInStock: (value: string) => void;

  minRating: string;
  setMinRating: (value: string) => void;

  attributes: ProductAttribute[];
  attributeValueIds: Set<number>;
  toggleAttributeValue: (id: number) => void;

  onApply: () => void;
  onReset: () => void;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  categories,
  categoryIds,
  handleSelectCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStock,
  setInStock,
  minRating,
  setMinRating,
  attributes,
  attributeValueIds,
  toggleAttributeValue,
  onApply,
  onReset,
}) => {
  return (
    <aside className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-text-primary">Filters</h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <section className="border-b border-border pb-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          Categories
        </h3>

        <CategoryTreeFilter
          categories={categories}
          selectedIds={categoryIds}
          onChange={handleSelectCategories}
        />
      </section>

      {/* Price */}
      <section className="border-b border-border py-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          Price range
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Availability */}
      <section className="border-b border-border py-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          Availability
        </h3>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={inStock === "true"}
            onChange={(e) => setInStock(e.target.checked ? "true" : "")}
          />
          In stock only
        </label>
      </section>

      {/* Rating */}
      <section className="border-b border-border py-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          Customer rating
        </h3>

        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">All ratings</option>
          <option value="4">4 stars & above</option>
          <option value="3">3 stars & above</option>
          <option value="2">2 stars & above</option>
          <option value="1">1 star & above</option>
        </select>
      </section>

      {/* Dynamic attributes */}
      {attributes.length > 0 && (
        <section className="py-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Product attributes
          </h3>

          <div className="space-y-4">
            {attributes.map((attribute) => (
              <fieldset key={attribute.id}>
                <legend className="mb-2 text-xs font-semibold text-text-secondary">
                  {attribute.name}
                </legend>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(attribute.values).map(([id, value]) => (
                    <label
                      key={id}
                      className="flex items-center gap-1.5 text-sm text-text-secondary"
                    >
                      <input
                        type="checkbox"
                        checked={attributeValueIds.has(Number(id))}
                        onChange={() => toggleAttributeValue(Number(id))}
                      />
                      {String(value)}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={onApply}
        className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Apply filters
      </button>
    </aside>
  );
};

export default ShopFilters;
