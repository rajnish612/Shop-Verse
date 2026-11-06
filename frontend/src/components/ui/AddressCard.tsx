import React from "react";
import { MapPin, Trash2, MapPinned, CheckCircle2 } from "lucide-react";
import type { Address } from "../../types";

interface AddressCardProps {
  address: Address;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onDelete,
  isDeleting = false,
  isSelected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect?.(address.id)}
      className={`rounded-xl border bg-white p-5 shadow-sm transition ${
        onSelect ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-100"
          : "border-slate-200 hover:border-indigo-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {onSelect && (
            <input
              type="radio"
              name="checkout-address"
              checked={isSelected}
              onChange={() => onSelect(address.id)}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 accent-indigo-600"
            />
          )}

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">{address.locality}</h3>
            <p className="text-xs text-slate-500">Saved address</p>
          </div>
        </div>
        {isSelected ? (
          <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Selected
          </span>
        ) : (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            Address
          </span>
        )}
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p className="flex items-start gap-2">
          <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>
            {address.locality}, {address.city}, {address.state}
          </span>
        </p>

        <p className="pl-6">
          {address.country} - {address.zipCode}
        </p>
      </div>

      {onDelete && (
        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
