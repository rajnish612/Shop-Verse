import React from "react";
import { categoriesApi } from "../../services/category";
import { type Category } from "../../types";
import {
  ChevronDown,
  Edit2,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
interface CreateOrEditCategoryModalProps {
  editingCategory: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  code: string;
  parentId?: number;
  isSaving: boolean;
  onSaveCategory: () => void;
}

//Modal to create or edit categories
const CreateOrEditCategoryModal: React.FC<CreateOrEditCategoryModalProps> = ({
  editingCategory,
  onClose,
  name,
  onNameChange,
  code,
  isSaving,
  onCodeChange,
  onSaveCategory,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-lg font-bold text-text-primary">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Smart Wearables"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Category Code (Slug)
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="e.g. smart-wearables"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              onClick={onSaveCategory}
              disabled={isSaving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : editingCategory
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderCategoryTree = (
  category: Category,
  depth = 0,
  onAddModalOpen: (id?: number) => void,
  onEditModalOpen: (category: Category) => void,
  onCategoryDelete: (id: number) => void,
): React.ReactNode => {
  const isRoot = depth === 0;

  return (
    <div key={category.id} className={isRoot ? "p-3" : "mt-1.5"}>
      <div
        className={`flex items-center justify-between rounded-lg p-2.5 transition hover:bg-surface-hover ${
          isRoot
            ? "bg-surface-alt/50 p-3"
            : "border border-transparent hover:border-border"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {isRoot ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderOpen className="h-5 w-5" />
            </div>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-text-muted" />
              <Folder className="h-4 w-4 flex-shrink-0 text-amber-500" />
            </>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`truncate text-text-primary ${isRoot ? "font-semibold" : "text-sm font-medium"}`}
              >
                {category.name}
              </span>
              <span className="font-mono text-xs text-text-muted">
                ({category.code})
              </span>
            </div>
            <span className="text-xs text-text-muted">
              Level {category.level} • {category.children.length} subcategories
            </span>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            onClick={() => onAddModalOpen(category.id)}
            className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-primary transition"
            title="Add Subcategory"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEditModalOpen(category)}
            className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-primary transition"
            title="Edit Category"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onCategoryDelete(category.id)}
            className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-danger transition"
            title="Delete Category"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {category.children.length > 0 && (
        <div
          className={`space-y-1.5 border-l-2 border-border pl-4 ${isRoot ? "ml-6 mt-2" : "ml-4"}`}
        >
          {category.children.map((child) =>
            renderCategoryTree(
              child,
              depth + 1,
              onAddModalOpen,
              onEditModalOpen,
              onCategoryDelete,
            ),
          )}
        </div>
      )}
    </div>
  );
};
//Categories page component
const CategoriesPage = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [code, setCode] = React.useState<string>("");
  const [saving, setIsSaving] = React.useState<boolean>(false);

  const [categoryId, setCategoryId] = React.useState<number | undefined>(
    undefined,
  );
  const [editingCategory, setIsEditingCategory] =
    React.useState<boolean>(false);

  //Load categories
  const loadCategories = async () => {
    try {
      const categories = await categoriesApi.getAll();
      setCategories(categories);
    } catch (err) {
      console.log("err loading", err);
    } finally {
    }
  };
  //handle category add modal
  const handleAddModalOpen = (id?: number) => {
    setCategoryId(id);
    setName("");
    setCode("");
    setIsEditingCategory(false);
    setIsModalOpen(true);
  };
  //handle category edit modal
  const handleEditModalOpen = (category: Category) => {
    setCategoryId(undefined);
    setCategoryId(category.id);
    setName(category.name);
    setCode(category.code);
    setIsEditingCategory(true);
    setIsModalOpen(true);
  };

  //Create new category
  const createCategory = async () => {
    setIsSaving(true);
    try {
      const data = await categoriesApi.create({
        name,
        code,
        parentId: categoryId,
      });
      setIsModalOpen(false);

      await loadCategories();
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsSaving(false);
    }
  };

  //Update existing category
  const updateCategory = async () => {
    if (categoryId === undefined) return;
    setIsSaving(true);

    try {
      const data = await categoriesApi.update(categoryId, {
        name: name.trim(),
        code: code.trim(),
      });
      setIsModalOpen(false);

      await loadCategories();
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsSaving(false);
    }
  };
  //Save category
  const handleSaveCategory = async () => {
    if (!name.trim() || !code.trim()) {
      return;
    }
    if (!editingCategory) {
      await createCategory();
    } else {
      await updateCategory();
    }
  };
  //Delete category
  const handleDeleteCategory = async (id: number) => {
    if (!id) return;
    try {
      await categoriesApi.remove(id);
      loadCategories();
    } catch (err) {}
  };

  //Fetch all categories
  React.useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Category Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Organize catalog hierarchy with root categories and nested
            subcategories.
          </p>
        </div>
        <button
          onClick={() => handleAddModalOpen()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Render all categories */}
      {categories.map((root) =>
        renderCategoryTree(
          root,
          0,
          handleAddModalOpen,
          handleEditModalOpen,
          handleDeleteCategory,
        ),
      )}
      {isModalOpen && (
        <CreateOrEditCategoryModal
          editingCategory={editingCategory}
          onClose={() => setIsModalOpen(false)}
          name={name}
          isSaving={saving}
          onSaveCategory={handleSaveCategory}
          onNameChange={(value) => setName(value)}
          onCodeChange={(value) => setCode(value)}
          code={code}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
