import React from "react";
import { attributesApi } from "../../services/attributes";
import { Link } from "react-router";
import { type Category, type ProductAttribute } from "../../types";
import {
  productApis,
  type CreateProductRequest,
} from "../../services/products";
import { categoriesApi } from "../../services/category";
import CategoryTreeFilter from "../../components/ui/CategoryTreeFilter";
import {
  validateProductCreationForm,
  type ProductFormErrors,
} from "../../utils/helperFunctions";

const AddOrEditProduct: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<ProductFormErrors>({});
  const [attributes, setAttributes] = React.useState<ProductAttribute[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [formData, setFormData] = React.useState<CreateProductRequest>({
    name: "",
    description: "",
    categoryId: 0,
    mrpPrice: 0,
    discount: 0,
    stockQuantity: 0,
    imageUrls: [],
    attributeValueIds: new Set(),
  });
  const [saving, setIsSaving] = React.useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);
  const [attributesLoading, setAttributesLoading] =
    React.useState<boolean>(false);
  //Fetch all attributes
  React.useEffect(() => {
    attributesApi
      .getAll()
      .then((data) => setAttributes(data))
      .catch((err) => console.log("err", err))
      .finally(() => setAttributesLoading(false));
  }, []);

  //Toggle attribute selection
  const toggleAttribute = (valueId: number) => {
    setFormData((prev) => {
      const updated = new Set(prev.attributeValueIds);

      if (updated.has(valueId)) {
        updated.delete(valueId);
      } else {
        updated.add(valueId);
      }

      return {
        ...prev,
        attributeValueIds: updated,
      };
    });
  };
  //Handle change
  const handleChange = <K extends keyof CreateProductRequest>(
    field: K,
    value: CreateProductRequest[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //Fetch all categories
  React.useEffect(() => {
    categoriesApi
      .getAll()
      .then((data) => setCategories(data))
      .catch((err) => {
        console.log("err fetching categories", err);
      });
  }, []);

  //Create product
  const handleCreateProduct = async () => {
    const validationErrors = validateProductCreationForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      const data = await productApis.create({
        ...formData,
        attributeValueIds: Array.from(formData.attributeValueIds),
      });
      console.log("product created", data);
    } catch (err) {
      console.error("Error creating product", err.response.message);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>
          <p className="text-sm text-slate-500">
            Enter your product details below.
          </p>
        </div>
      </div>
      {/* Create or edit product section */}
      <section
        // onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
      >
        {/* {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )} */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name *
          </label>
          <input
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter product name"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Input for description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            maxLength={2000}
            rows={4}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe your product"
            className="w-full border rounded-lg p-3 resize-y"
          />
          <p className="text-xs text-slate-400 text-right">
            {formData.description.length}/2000
          </p>
        </div>

        {/* Input for mrp price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              MRP Price (₹) *
            </label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={formData.mrpPrice}
              onChange={(e) => handleChange("mrpPrice", Number(e.target.value))}
              placeholder="0.00"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Input for discount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.discount}
              onChange={(e) => handleChange("discount", Number(e.target.value))}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Input for stock  */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Stock Quantity *
            </label>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={formData.stockQuantity}
              onChange={(e) =>
                handleChange("stockQuantity", Number(e.target.value))
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <CategoryTreeFilter
            categories={categories}
            selectedIds={
              selectedCategoryId !== null
                ? new Set([selectedCategoryId])
                : new Set<number>()
            }
            onChange={(categoryId: number) => {
              setSelectedCategoryId(categoryId);
              handleChange("categoryId", categoryId);
            }}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3">Product Attributes *</h2>
          <p className="text-sm text-slate-500 mb-4">
            Select the applicable values for your product.
          </p>

          {/* Select Attributes */}
          {attributes.length === 0 ? (
            <p className="text-sm text-slate-500">
              No attributes available. Ask an admin to create them.
            </p>
          ) : (
            <div className="space-y-4">
              {attributes.map((attribute) => (
                <div key={attribute.id}>
                  <p className="text-sm font-medium mb-2">{attribute.name}</p>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(attribute.values).map(([id, value]) => {
                      const selected = formData.attributeValueIds.has(
                        Number(id),
                      );

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleAttribute(Number(id))}
                          className={`px-3 py-2 text-sm rounded-lg border ${
                            selected
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white text-slate-700 border-slate-200 hover:border-emerald-500"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigate back to admin products page */}
        <div className="flex justify-end gap-3 border-t pt-5">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-lg border text-sm font-medium"
          >
            Cancel
          </Link>

          <button type="button" onClick={handleCreateProduct} disabled={saving}>
            {saving ? "Saving..." : "Publish Product"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AddOrEditProduct;
