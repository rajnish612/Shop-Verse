import type { CreateProductRequest } from "../services/products";

export interface ProductFormErrors {
  name?: string;
  description?: string;
  categoryId?: string;
  mrpPrice?: string;
  discount?: string;
  stockQuantity?: string;
  attributeValueIds?: string;
}

export const validateProductCreationForm = (
  formData: CreateProductRequest,
): ProductFormErrors => {
  const errors: ProductFormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Product name is required";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required";
  }

  if (formData.categoryId <= 0) {
    errors.categoryId = "Please select a category";
  }

  if (!Number.isFinite(formData.mrpPrice) || formData.mrpPrice <= 0) {
    errors.mrpPrice = "MRP must be greater than 0";
  }

  if (
    !Number.isFinite(formData.discount) ||
    formData.discount < 0 ||
    formData.discount > 100
  ) {
    errors.discount = "Discount must be between 0 and 100";
  }

  if (!Number.isInteger(formData.stockQuantity) || formData.stockQuantity < 0) {
    errors.stockQuantity = "Stock must be a non-negative integer";
  }

  if (formData.attributeValueIds.size === 0) {
    errors.attributeValueIds = "Select at least one attribute value";
  }

  return errors;
};
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountedPrice(mrpPrice: number, discount: number): number {
  return Math.round(mrpPrice * (1 - discount / 100));
}
