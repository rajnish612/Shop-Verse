import {
  UserRound,
  Mail,
  CalendarDays,
  ShieldCheck,
  MapPin,
  ChartNoAxesCombined,
  CheckCircle2,
  Package,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile header */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-indigo-600 text-3xl font-bold text-white shadow-md">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-text-primary">
                  {user.name || "User"}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">{user.email}</p>
              </div>
            </div>

            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Package size={16} />
              My Orders
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
              >
                {role}
              </span>
            ))}

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                user.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <CheckCircle2 size={13} />
              {user.active ? "Active Account" : "Inactive Account"}
            </span>
          </div>
        </div>
      </section>

      {/* Personal and account information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Personal information */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserRound size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                Personal Information
              </h3>
              <p className="text-xs text-text-secondary">
                Your basic profile details
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                Full Name
              </p>
              <p className="text-sm font-medium text-text-primary">
                {user.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                Email Address
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <Mail size={15} className="text-text-muted" />
                <span className="break-all">{user.email}</span>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                Member Since
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <CalendarDays size={15} className="text-text-muted" />
                {formatDate(user.joinedAt)}
              </div>
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                Account Information
              </h3>
              <p className="text-xs text-text-secondary">
                Your account and security details
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Account ID
              </p>
              <p className="text-sm font-medium text-text-primary">
                #{user.id}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Google Account
              </p>
              <div className="flex items-center gap-2">
                <ChartNoAxesCombined size={17} className="text-text-muted" />
                <span className="text-sm font-medium text-text-primary">
                  {user.googleLinked ? "Connected" : "Not connected"}
                </span>
                {user.googleLinked && (
                  <CheckCircle2 size={15} className="text-emerald-600" />
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Assigned Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-md bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-secondary"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Saved addresses */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                Saved Addresses
              </h3>
              <p className="text-xs text-text-secondary">
                Your saved delivery locations
              </p>
            </div>
          </div>

          <Link
            to="/addresses"
            className="text-sm font-medium text-primary hover:underline"
          >
            Manage
          </Link>
        </div>

        {user.addresses?.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {user.addresses.map((address, index) => (
              <div
                key={`${address.locality}-${address.zipCode}-${index}`}
                className="rounded-xl border border-border bg-surface-alt/40 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <MapPin size={15} className="text-primary" />
                  <span className="text-sm font-semibold text-text-primary">
                    Address {index + 1}
                  </span>
                </div>

                <p className="text-sm leading-6 text-text-secondary">
                  {address.locality}
                  <br />
                  {address.city}, {address.state} - {address.zipCode}
                  <br />
                  {address.country}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-8 text-center">
            <MapPin className="mx-auto mb-2 text-text-muted" size={26} />
            <p className="text-sm font-medium text-text-primary">
              No saved addresses
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Add an address for a faster checkout experience.
            </p>
            <Link
              to="/addresses"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Add an address
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
