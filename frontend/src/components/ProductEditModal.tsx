import React from "react";
import { X, Save, Loader2 } from "lucide-react";
import type { Category, Product, ProductAttribute } from "../types";
import { productApis } from "../services/products";
import { type UpdateProductRequest } from "../services/products";
import { toast } from "sonner";
interface ProductEditModalProps {
  product: Product;
  categories: Category[];
  attributes: ProductAttribute[];
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  categories,
  attributes,
  onClose,
  onSave,
}) => {
  const [name, setName] = React.useState(product.name);
  const [description, setDescription] = React.useState(product.description);
  const [categoryId, setCategoryId] = React.useState(
    String(product.categoryId),
  );
  const [mrpPrice, setMrpPrice] = React.useState(String(product.mrpPrice));
  const [discount, setDiscount] = React.useState(String(product.discount));
  const [stockQuantity, setStockQuantity] = React.useState(
    String(product.stockQuantity),
  );

  const [imageUrls, setImageUrls] = React.useState(
    product.imageUrls.join("\n"),
  );

  // Assumes product.attributes contains only the attribute values
  // currently assigned to this product.
  const [selectedAttributeValueIds, setSelectedAttributeValueIds] =
    React.useState<Set<number>>(
      new Set(
        product.attributes.flatMap((attribute) =>
          Object.keys(attribute.values).map(Number),
        ),
      ),
    );

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const flattenedCategories = React.useMemo(() => {
    const result: { id: number; name: string; level: number }[] = [];

    const flatten = (items: Category[]) => {
      items.forEach((category) => {
        result.push({
          id: category.id,
          name: category.name,
          level: category.level,
        });

        if (category.children?.length) {
          flatten(category.children);
        }
      });
    };

    flatten(categories);
    return result;
  }, [categories]);

  const toggleAttributeValue = (valueId: number) => {
    setSelectedAttributeValueIds((current) => {
      const next = new Set(current);

      if (next.has(valueId)) {
        next.delete(valueId);
      } else {
        next.add(valueId);
      }

      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const parsedMrp = Number(mrpPrice);
    const parsedDiscount = Number(discount);
    const parsedStock = Number(stockQuantity);
    const parsedCategoryId = Number(categoryId);

    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required.");
      return;
    }

    if (!parsedCategoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (!Number.isFinite(parsedMrp) || parsedMrp <= 0) {
      toast.error("MRP price must be greater than 0.");
      return;
    }

    if (
      !Number.isFinite(parsedDiscount) ||
      parsedDiscount < 0 ||
      parsedDiscount > 100
    ) {
      toast.error("Discount must be between 0 and 100.");
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      toast.error("Stock quantity cannot be negative.");
      return;
    }

    const request: UpdateProductRequest = {
      name: name.trim(),
      description: description.trim(),
      categoryId: parsedCategoryId,
      mrpPrice: parsedMrp,
      discount: parsedDiscount,
      stockQuantity: parsedStock,
      imageUrls: imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      attributeValueIds: Array.from(selectedAttributeValueIds),
    };

    try {
      setSaving(true);

      const updatedProduct = await productApis.update(product.id, request);
      toast.success("Product updated successfully");
      onSave(updatedProduct);
    } catch (err) {
      setError("Failed to update product.", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Edit Product
            </h2>
            <p className="text-xs text-text-secondary">
              Update product information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Basic details */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Product Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            >
              <option value="">Select category</option>

              {flattenedCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {"— ".repeat(category.level)}
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing and stock */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                MRP Price
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={mrpPrice}
                onChange={(e) => setMrpPrice(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Stock
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
              />
            </div>
          </div>

          {/* Image URLs */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Image URLs
            </label>
            <textarea
              rows={3}
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder={"Enter one image URL per line"}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            />
            <p className="mt-1 text-xs text-text-secondary">
              Enter each image URL on a separate line.
            </p>
          </div>

          {/* Attributes */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Product Attributes
            </h3>

            {attributes.length === 0 ? (
              <p className="text-xs text-text-secondary">
                No attributes available.
              </p>
            ) : (
              <div className="space-y-4">
                {attributes.map((attribute) => (
                  <fieldset key={attribute.id}>
                    <legend className="mb-2 text-sm font-medium text-text-secondary">
                      {attribute.name}
                    </legend>

                    <div className="flex flex-wrap gap-3">
                      {Object.entries(attribute.values).map(([id, value]) => {
                        const valueId = Number(id);

                        return (
                          <label
                            key={id}
                            className="flex items-center gap-2 text-sm text-text-primary"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAttributeValueIds.has(valueId)}
                              onChange={() => toggleAttributeValue(valueId)}
                            />
                            {value}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
