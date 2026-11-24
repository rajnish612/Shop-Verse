import {
  Calendar,
  Edit2,
  Loader2,
  Mail,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserIcon,
  UserX,
  X,
} from "lucide-react";
import React from "react";
import { RoleType, type UserDetails } from "../../types";
import { userApi } from "../../services/users";
import { toast } from "sonner";

//Props for role modal
interface RoleModalProps {
  editingUser: UserDetails;
  onClose: () => void;
  selectedRoles: RoleType[];
  handleRoleToggle: (role: RoleType) => void;
  handleSaveRoles: () => void;
  isSaving: boolean;
}

//Role modal component
const RoleModal: React.FC<RoleModalProps> = ({
  editingUser,
  onClose,
  selectedRoles,
  handleRoleToggle,
  handleSaveRoles,
  isSaving,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              Edit User Roles
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Assign roles to {editingUser.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {[RoleType.ADMIN].map((role) => {
            const isChecked = selectedRoles.includes(role);
            return (
              <label
                key={role}
                className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition ${
                  isChecked
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface hover:bg-surface-hover"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className={`h-5 w-5 ${isChecked ? "text-primary" : "text-text-muted"}`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {role}
                    </p>
                    <p className="text-xs text-text-muted">
                      {role === RoleType.ADMIN
                        ? "Full administrative control and configuration"
                        : "Standard customer privileges and purchasing access"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isSaving}
                  onChange={() => handleRoleToggle(role)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveRoles}
            disabled={isSaving}
            className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Roles"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
const UsersPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSavingRoles, setIsSavingRoles] = React.useState(false);
  const [updatingUserId, setUpdatingUserId] = React.useState<number | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [roleFilter, setRoleFilter] = React.useState<RoleType | "ALL">("ALL");
  const [users, setUsers] = React.useState<UserDetails[]>([]);
  const [editingUser, setEditingUser] = React.useState<UserDetails | null>(
    null,
  );
  const [selectedRoles, setSelectedRoles] = React.useState<RoleType[]>([]);

  //Pagination
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const handleRoleToggle = (role: RoleType) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };
  //Get role colors
  const getRoleBadgeColor = (role: RoleType) => {
    switch (role) {
      case RoleType.ADMIN:
        return "bg-purple-50 text-purple-700 border-purple-200";

      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  //Update user roles
  const saveRoles = async () => {
    if (!editingUser?.id || isSavingRoles) return;

    try {
      setIsSavingRoles(true);

      const data = await userApi.updateRoles(editingUser.id, selectedRoles);

      toast.success("User roles updated");

      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));

      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user roles:", err);
    } finally {
      setIsSavingRoles(false);
    }
  };

  //Update user status
  const updateStatus = async (id: number, active: boolean) => {
    if (updatingUserId !== null) return;

    try {
      setUpdatingUserId(id);

      const data = await userApi.updateStatus(id, active);

      toast.success("User status updated");

      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    } catch (err) {
      console.error("Error updating user status:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };
  //Fetch all users
  React.useEffect(() => {
    userApi
      .getAllUsers(
        searchQuery,
        roleFilter !== "ALL" ? roleFilter : null,
        null,
        currentPage,
        pageSize,
      )
      .then((data) => {
        setUsers(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [roleFilter, searchQuery, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Users Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage user accounts, assign admin/seller privileges, and control
            platform access.
          </p>
        </div>
      </div>
      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full rounded-lg border border-border bg-surface pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
        <div className="sm:col-span-4">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as RoleType | "ALL");
              setCurrentPage(0);
            }}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          >
            <option value="ALL">All Roles</option>
            <option value={RoleType.ADMIN}>Admin</option>

            <option value={RoleType.USER}>Customer (User)</option>
          </select>
        </div>
      </div>
      {/* Users Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-alt text-xs font-semibold uppercase text-text-secondary border-b border-border">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Roles</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-text-secondary">
                        Loading users...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    <UserIcon className="mx-auto h-10 w-10 text-text-muted/60 mb-2" />
                    No users found matching your query.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition hover:bg-surface-hover ${
                      idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                    }`}
                  >
                    {/* Avatar & Name & Email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover border border-border"
                        />
                        <div>
                          <p className="font-semibold text-text-primary">
                            {user.name}
                          </p>
                          <p className="text-xs text-text-muted flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Roles Badges */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border ${getRoleBadgeColor(
                              role,
                            )}`}
                          >
                            <Shield className="h-3 w-3" />
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    {/* Joined Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-text-secondary">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-text-muted" />
                        {new Date(user.joinedAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    {/* Status Badge */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setSelectedRoles(user.roles);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-primary transition"
                          title="Edit Roles"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Role
                        </button>
                        <button
                          onClick={() => updateStatus(user.id, !user.active)}
                          disabled={updatingUserId !== null}
                          className={`inline-flex min-w-[100px] items-center justify-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            user.active
                              ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                          title={user.active ? "Block User" : "Unblock User"}
                        >
                          {updatingUserId === user.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Updating...
                            </>
                          ) : user.active ? (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              Block
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              Unblock
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            Showing{" "}
            <span className="font-medium text-text-primary">
              {currentPage * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-text-primary">
              {Math.min((currentPage + 1) * pageSize, totalElements)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-text-primary">
              {totalElements}
            </span>{" "}
            users
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 0 || isLoading}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-text-secondary">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* {Role Modal} */}
      {editingUser && (
        <RoleModal
          editingUser={editingUser}
          onClose={() => setEditingUser(null)}
          selectedRoles={selectedRoles}
          handleRoleToggle={handleRoleToggle}
          handleSaveRoles={saveRoles}
          isSaving={isSavingRoles}
        />
      )}
    </div>
  );
};

export default UsersPage;
