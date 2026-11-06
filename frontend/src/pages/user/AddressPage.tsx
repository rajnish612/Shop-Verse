import React, { useCallback, useEffect, useState } from "react";
import { Plus, MapPin, X, Trash2, Loader2 } from "lucide-react";

import AddressCard from "../../components/ui/AddressCard";
import { addressesApi } from "../../services/address";
import type { Address } from "../../types";
// Temporary user ID for development.
// Replace this with the logged-in user's ID from your auth state.
const USER_ID = 1;

interface AddressForm {
  locality: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const emptyAddress: AddressForm = {
  locality: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
};

const AddressPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<AddressForm>(emptyAddress);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch addresses
  const loadAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await addressesApi.getByUser(USER_ID);
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setError("Unable to load your addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Open add modal
  const openAddModal = () => {
    setFormData(emptyAddress);
    setErrors({});
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(emptyAddress);
    setErrors({});
    setFormError("");
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    if (
      formData.zipCode.trim() &&
      !/^[0-9]{5,10}$/.test(formData.zipCode.trim())
    ) {
      newErrors.zipCode = "Enter a valid postal code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Create address
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setFormError("");

      const request = {
        locality: formData.locality.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        zipCode: formData.zipCode.trim(),
      };

      const createdAddress = await addressesApi.create(USER_ID, request);

      setAddresses((prev) => [...prev, createdAddress]);

      closeModal();
    } catch (err) {
      console.error("Failed to create address:", err);
      setFormError("Unable to save address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete address
  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      setDeletingId(deleteId);

      await addressesApi.remove(USER_ID, deleteId);

      setAddresses((prev) => prev.filter((address) => address.id !== deleteId));

      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete address:", err);
      setError("Unable to delete address. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const fields: {
    name: keyof AddressForm;
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "locality",
      label: "Locality / Area",
      placeholder: "Enter locality or area",
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter city",
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter state",
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Enter country",
    },
    {
      name: "zipCode",
      label: "ZIP / Postal Code",
      placeholder: "Enter postal code",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-indigo-600" />
              My Account / Addresses
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Addresses
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your saved delivery addresses.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <p>{error}</p>
            <button
              onClick={loadAddresses}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Address count */}
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-700">
            Saved Addresses ({addresses.length})
          </p>
        </div>

        {/* Address list */}
        {isLoading ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onDelete={setDeleteId}
                isDeleting={deletingId === address.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <MapPin className="h-8 w-8 text-indigo-600" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No addresses saved yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Add a delivery address to make your future purchases easier.
            </p>

            <button
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add New Address
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your delivery address details.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-100 ${
                      errors[field.name]
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />

                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>

            <h2 className="mt-4 text-center text-lg font-bold text-slate-900">
              Delete Address?
            </h2>

            <p className="mt-2 text-center text-sm text-slate-500">
              Are you sure you want to delete this saved address?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deletingId !== null}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId !== null && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
