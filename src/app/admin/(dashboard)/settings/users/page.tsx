"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setCreating(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, displayName, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create admin");
      }

      setUsername("");
      setEmail("");
      setDisplayName("");
      setPassword("");
      await fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete admin");
      }
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete admin");
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-warm-brown/50">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-warm-brown">
        Admin Users
      </h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* User list */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-brown/10">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Display Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-brown/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-warm-gray/50">
                <td className="px-6 py-4 text-sm font-medium text-warm-brown">
                  {user.displayName}
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown/70">
                  {user.username}
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown/70">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown/70">
                  {formatDate(user.lastLoginAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setDeleteTarget({ id: user.id, name: user.displayName })}
                    className="text-sm text-red-500 transition-colors hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-warm-brown/50">
            No admin users yet
          </p>
        )}
      </div>

      {/* Create new admin form */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-warm-brown">
          Add New Admin
        </h2>

        {formError && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreate} className="mt-4 max-w-lg space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-warm-brown">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full rounded-lg border border-warm-brown/20 px-3 py-2 text-sm focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-warm-brown">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-warm-brown/20 px-3 py-2 text-sm focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-warm-brown">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full rounded-lg border border-warm-brown/20 px-3 py-2 text-sm focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-warm-brown">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-warm-brown/20 px-3 py-2 text-sm focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
              placeholder="Min 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-teal-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-primary/90 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Admin"
        message={`Are you sure you want to delete admin "${deleteTarget?.name ?? ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
