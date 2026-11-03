import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { type Category } from "../../types";
import { categoriesApi } from "../../services/category";

interface NavbarCategoryTreeProps {
  onNavigate?: () => void;
}

const NavbarCategoryTree: React.FC<NavbarCategoryTreeProps> = ({
  onNavigate,
}) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleExpanded = (id: number) => {
    setExpanded((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/shop/${categoryId}`);
    onNavigate?.();
  };

  const renderTree = (items: Category[], depth = 0): React.ReactNode =>
    items.map((category) => {
      const children = category.children ?? [];
      const hasChildren = children.length > 0;
      const isExpanded = expanded.has(category.id);

      return (
        <div key={category.id}>
          <div
            className="flex min-w-0 items-center gap-1 rounded-lg pr-2 transition-colors hover:bg-surface-hover"
            style={{ paddingLeft: `${depth * 16 + 4}px` }}
          >
            <button
              type="button"
              onClick={() => toggleExpanded(category.id)}
              disabled={!hasChildren}
              aria-label={isExpanded ? "Collapse category" : "Expand category"}
              className="flex h-9 w-6 shrink-0 items-center justify-center rounded text-text-muted disabled:invisible"
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
              onClick={() => handleCategoryClick(category.id)}
              className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left"
            >
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Folder className="h-4 w-4 shrink-0 text-primary" />
                )
              ) : (
                <Folder className="h-4 w-4 shrink-0 text-text-muted" />
              )}

              <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
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

  if (loading) {
    return (
      <p className="px-2 py-4 text-center text-sm text-text-muted">
        Loading categories...
      </p>
    );
  }

  return (
    <div className="w-full min-w-0">
      {categories.length > 0 ? (
        <div className="max-h-72 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {renderTree(categories)}
        </div>
      ) : (
        <p className="px-2 py-4 text-center text-sm text-text-muted">
          No categories available.
        </p>
      )}
    </div>
  );
};

export default NavbarCategoryTree;
