import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  Folder,
  FolderOpen,
  Search,
  X,
} from "lucide-react";
import { type Category } from "../../types";
interface CategoryTreeFilterProps {
  categories: Category[];
  selectedIds: Set<number>;
  onChange: (categoryId: number) => void;
}

export const CategoryTreeFilter: React.FC<CategoryTreeFilterProps> = ({
  categories,
  selectedIds,
  onChange,
}) => {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filterTree = (items: Category[]): Category[] =>
    items.reduce<Category[]>((result, category) => {
      const children = filterTree(category.children ?? []);
      const matches =
        category.name.toLowerCase().includes(query) ||
        category.code.toLowerCase().includes(query);

      if (!query || matches || children.length > 0) {
        result.push({ ...category, children });
      }

      return result;
    }, []);

  const visibleCategories = filterTree(categories);

  const toggleExpanded = (id: number) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderTree = (items: Category[], depth = 0): React.ReactNode =>
    items.map((category) => {
      const children = category.children ?? [];
      const hasChildren = children.length > 0;
      const isExpanded = query.length > 0 || expanded.has(category.id);
      const categoryId = category.id;
      const isSelected = selectedIds.has(category.id);
      return (
        <div key={category.id}>
          <div
            className={`flex min-w-0 items-center gap-1 rounded-lg pr-2 transition-colors ${
              isSelected ? "bg-primary/10" : "hover:bg-surface-hover"
            }`}
            style={{ paddingLeft: `${depth * 16 + 4}px` }}
          >
            <button
              type="button"
              onClick={() => toggleExpanded(category.id)}
              disabled={!hasChildren}
              aria-label={isExpanded ? "Collapse category" : "Expand category"}
              className="flex h-8 w-6 shrink-0 items-center justify-center rounded text-text-muted disabled:invisible"
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => onChange(categoryId)}
              aria-pressed={isSelected}
              className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-border-dark bg-surface"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </span>

              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Folder className="h-4 w-4 shrink-0 text-primary" />
                )
              ) : (
                <Folder className="h-4 w-4 shrink-0 text-text-muted" />
              )}

              <span
                className={`min-w-0 flex-1 truncate text-sm ${
                  isSelected ? "font-medium text-primary" : "text-text-primary"
                }`}
              >
                {category.name}
              </span>
            </button>
          </div>

          {hasChildren && isExpanded && (
            <div className="ml-4 border-l border-border">
              {renderTree(children, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="w-full min-w-0">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          aria-label="Search categories"
          className="w-full min-w-0 rounded-lg border border-border bg-surface py-2 pl-9 pr-8 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear category search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category tree */}
      <div className="max-h-72 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {visibleCategories.length > 0 ? (
          renderTree(visibleCategories)
        ) : (
          <p className="px-2 py-6 text-center text-sm text-text-muted">
            No matching categories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryTreeFilter;
