import React from "react";
import { type ProductAttribute } from "../../types";
import { attributesApi } from "../../services/attributes";
import { Check, Edit2, Plus, Sliders, Tag, Trash2, X } from "lucide-react";
interface AddOrEditAttributeModalProps {
  handleModalClose: () => void;
  editingAttr: ProductAttribute | null;
  handleSaveAttr: () => void;
  attrValues: string;
  attrName: string;
  isSaving: boolean;
  handleChange: (attrName?: string, attrValues?: string) => void;
}

//Add or edit attribute modal
const AddOrEditAttributeModal: React.FC<AddOrEditAttributeModalProps> = ({
  handleModalClose,
  editingAttr,
  handleSaveAttr,
  attrValues,
  attrName,
  isSaving,
  handleChange,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs"
        onClick={handleModalClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {editingAttr ? "Edit Attribute" : "Create New Attribute"}
          </h3>
          <button
            onClick={handleModalClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Attribute Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Material, Storage, Warranty"
              value={attrName}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {!editingAttr && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Initial Values
              </label>
              <input
                type="text"
                required
                placeholder="Comma separated, e.g. Red, Blue, Green"
                value={attrValues}
                onChange={(e) => handleChange(undefined, e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-xs text-slate-500">
                The backend requires at least one value when creating an
                attribute.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleModalClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAttr}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Check className="h-4 w-4" />
              {isSaving
                ? "Saving..."
                : editingAttr
                  ? "Save Changes"
                  : "Create Attribute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AttributesProps {
  attributes: ProductAttribute[];
  handleOpenEditModal: (attr: ProductAttribute) => void;
  handleAttributeAddValue: (id: number, value: string) => void;
  handleRemoveAttributeValue: (id: number, valueId: number) => void;
  handleDeleteAttribute: (id: number) => void;
}

//Attributes component
const Attributes: React.FC<AttributesProps> = ({
  attributes,
  handleOpenEditModal,
  handleAttributeAddValue,
  handleRemoveAttributeValue,
  handleDeleteAttribute,
}) => {
  const valueRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <>
      {attributes.map((attr) => {
        const totalAttrValues = Object.values(attr.values).length;
        const attrValues = Object.entries(attr.values);

        return (
          <div
            key={attr.id}
            className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition"
          >
            {/* Attribute Header Bar */}
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Sliders className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 text-base">
                    {attr.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {totalAttrValues} configured value
                    {totalAttrValues !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleOpenEditModal(attr)}
                  type="button"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                  title="Edit Attribute Name"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDeleteAttribute(attr.id)}
                  type="button"
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete Attribute"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Expandable Values Panel */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                  Available Values
                </label>

                <div className="flex flex-wrap gap-2">
                  {totalAttrValues === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      No values defined yet. Add the first one below.
                    </p>
                  ) : (
                    attrValues.map(([id, val]) => (
                      <div
                        key={id}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs group"
                      >
                        <Tag className="h-3 w-3 text-slate-400" />
                        <span>{val}</span>

                        <button
                          onClick={() =>
                            handleRemoveAttributeValue(attr.id, Number(id))
                          }
                          type="button"
                          className="text-slate-400 hover:text-red-600 transition"
                          title="Remove Value"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Value Input */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Add New Value to {attr.name}
                </label>

                <div className="flex max-w-md items-center gap-2">
                  <input
                    ref={valueRef}
                    type="text"
                    placeholder={`e.g. ${
                      attr.name === "Color"
                        ? "Rose Gold"
                        : attr.name === "Size"
                          ? "XXXL"
                          : "New Value"
                    }`}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <button
                    onClick={() => {
                      if (!valueRef.current?.value.trim()) return;
                      handleAttributeAddValue(attr.id, valueRef.current.value);
                    }}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-2xs transition hover:bg-indigo-700 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add Value
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

//Attributes page component
const AttributesPage = () => {
  const [attributes, setAttributes] = React.useState<ProductAttribute[]>([]);
  const [editingAttr, setEditingAttr] = React.useState<ProductAttribute | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [attrName, setAttrName] = React.useState<string>("");
  const [attrValues, setAttrValues] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isRemoving, setIsRemoving] = React.useState<boolean>(false);
  const [isAdding, setIsAdding] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  //Fetch all attributes
  React.useEffect(() => {
    attributesApi
      .getAll()
      .then((data) => setAttributes(data))
      .catch((err) => console.log("err", err))
      .finally(() => setIsLoading(false));
  }, []);

  //Handle modal open
  const handleOpenAddModal = () => {
    setEditingAttr(null);
    setAttrName("");
    setAttrValues("");
    setIsModalOpen(!isModalOpen);
  };
  //Handle edit modal open
  const handleOpenEditModal = (attr: ProductAttribute) => {
    setEditingAttr(attr);
    setAttrName(attr.name);
    setAttrValues(Object.values(attr.values).join(","));
    setIsModalOpen(!isModalOpen);
  };

  //Handle attrname and attrvalues change
  const handleChange = (attrName?: string, attrValues?: string) => {
    if (attrName?.trim()) {
      setAttrName(attrName);
    }
    if (attrValues) {
      setAttrValues(attrValues);
    }
  };

  //Add new attribute value
  const handleAddAttributeValue = async (id: number, value: string) => {
    try {
      if (isRemoving || isAdding) return;
      const data = await attributesApi.addValue(id, value);
      setAttributes((prev) =>
        prev.map((attr) =>
          attr.id == id
            ? { ...attr, values: { ...attr.values, ...data } }
            : attr,
        ),
      );
    } catch (err) {
      console.log("err adding attribute value", err);
    }
  };
  //Remove attribute value
  const handleRemoveAttributeValue = async (id: number, valueId: number) => {
    try {
      if (isRemoving || isAdding) return;
      await attributesApi.deleteValue(valueId);
      setAttributes((prev) =>
        prev.map((attr) => {
          if (attr.id !== id) return attr;

          const { [valueId]: _, ...remainingValues } = attr.values;

          return { ...attr, values: remainingValues };
        }),
      );
    } catch (err) {
      console.log("err adding attribute value", err);
    }
  };
  //Handle delete attribute
  const handleDeleteAttribute = async (id: number) => {
    try {
      if (isRemoving || isAdding) return;
      setIsRemoving(true);
      await attributesApi.deleteAttribute(id);
      setAttributes((prev) => prev.filter((attr) => attr.id != id));
    } catch (err) {
      console.log("err adding attribute value", err);
    }
  };
  //Save attributes
  const handleSaveAttr = async () => {
    const name = attrName.trim();
    const values = [
      ...new Set(
        attrValues
          .split(",")
          .map((val) => val.trim())
          .filter(Boolean),
      ),
    ];

    if (!name || isSaving || (!editingAttr && values.length == 0)) return;
    try {
      setIsSaving(true);
      const saved = editingAttr
        ? await attributesApi.updateName(editingAttr.id, name)
        : await attributesApi.create(name, values);
      setAttributes((prev) =>
        editingAttr
          ? prev.map((attribute) =>
              attribute.id === saved.id ? saved : attribute,
            )
          : [...prev, saved],
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
      setEditingAttr(null);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Attributes
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage specifications, variants, and dimensions like Size, Color,
            Storage, and RAM.
          </p>
        </div>
      </div>
      <button
        onClick={handleOpenAddModal}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 shrink-0"
      >
        <Plus className="h-4 w-4" />
        Add Attribute
      </button>
      {/* // Add or edit attribute modal */}
      {isModalOpen && (
        <AddOrEditAttributeModal
          handleModalClose={handleOpenAddModal}
          editingAttr={editingAttr}
          handleSaveAttr={handleSaveAttr}
          attrValues={attrValues}
          attrName={attrName}
          isSaving={isSaving}
          handleChange={handleChange}
        />
      )}
      {/* //All attributes */}
      {attributes.length != 0 && (
        <Attributes
          handleAttributeAddValue={handleAddAttributeValue}
          handleOpenEditModal={handleOpenEditModal}
          handleRemoveAttributeValue={handleRemoveAttributeValue}
          attributes={attributes}
          handleDeleteAttribute={handleDeleteAttribute}
        />
      )}
    </div>
  );
};

export default AttributesPage;
