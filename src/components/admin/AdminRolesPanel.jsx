import { useState } from "react";
import { Copy, Pencil, Plus, Trash2, Users } from "lucide-react";
import AdminModal from "./AdminModal";

import { adminRequest as request } from "@/lib/adminApi";

const SYSTEM_PERMISSIONS = [
  { id: "dashboard.view", key: "dashboard.view", module: "Tableau de bord", label: "Consulter les indicateurs & graphiques" },
  { id: "orders.view", key: "orders.view", module: "Commandes", label: "Voir les commandes" },
  { id: "orders.update", key: "orders.update", module: "Commandes", label: "Modifier le statut & suivi" },
  { id: "orders.cancel", key: "orders.cancel", module: "Commandes", label: "Annuler des commandes" },
  { id: "orders.delete", key: "orders.delete", module: "Commandes", label: "Supprimer des commandes" },
  { id: "products.view", key: "products.view", module: "Catalogue & Produits", label: "Voir les fiches produits" },
  { id: "products.create", key: "products.create", module: "Catalogue & Produits", label: "Créer des produits" },
  { id: "products.update", key: "products.update", module: "Catalogue & Produits", label: "Modifier les fiches & prix" },
  { id: "products.delete", key: "products.delete", module: "Catalogue & Produits", label: "Supprimer des produits" },
  { id: "categories.view", key: "categories.view", module: "Catalogue & Produits", label: "Gérer les catégories" },
  { id: "inventory.view", key: "inventory.view", module: "Stock & Inventaire", label: "Consulter les stocks" },
  { id: "inventory.adjust", key: "inventory.adjust", module: "Stock & Inventaire", label: "Ajuster les quantités de stock" },
  { id: "inventory.update", key: "inventory.update", module: "Stock & Inventaire", label: "Modifier les seuils d'alerte" },
  { id: "customers.view", key: "customers.view", module: "Clients", label: "Consulter la base clients" },
  { id: "shipping.view", key: "shipping.view", module: "Livraison & Zones", label: "Consulter les zones de livraison" },
  { id: "shipping.update", key: "shipping.update", module: "Livraison & Zones", label: "Modifier les tarifs & délais" },
  { id: "discounts.view", key: "discounts.view", module: "Marketing & Codes promo", label: "Voir les codes promo" },
  { id: "discounts.create", key: "discounts.create", module: "Marketing & Codes promo", label: "Créer des codes promo" },
  { id: "discounts.update", key: "discounts.update", module: "Marketing & Codes promo", label: "Modifier les remises" },
  { id: "discounts.delete", key: "discounts.delete", module: "Marketing & Codes promo", label: "Supprimer des codes" },
  { id: "reviews.view", key: "reviews.view", module: "Avis clients", label: "Voir les avis" },
  { id: "reviews.update", key: "reviews.update", module: "Avis clients", label: "Approuver / Modérer les avis" },
  { id: "users.view", key: "users.view", module: "Utilisateurs & Sécurité", label: "Voir les administrateurs" },
  { id: "users.create", key: "users.create", module: "Utilisateurs & Sécurité", label: "Créer des administrateurs" },
  { id: "users.update", key: "users.update", module: "Utilisateurs & Sécurité", label: "Modifier les accès utilisateurs" },
  { id: "users.delete", key: "users.delete", module: "Utilisateurs & Sécurité", label: "Supprimer des utilisateurs" },
  { id: "roles.view", key: "roles.view", module: "Rôles & Permissions", label: "Consulter les rôles" },
  { id: "roles.create", key: "roles.create", module: "Rôles & Permissions", label: "Créer des rôles personnalisés" },
  { id: "roles.update", key: "roles.update", module: "Rôles & Permissions", label: "Modifier les permissions des rôles" },
  { id: "roles.delete", key: "roles.delete", module: "Rôles & Permissions", label: "Supprimer des rôles" },
  { id: "settings.view", key: "settings.view", module: "Paramètres & Réglages", label: "Voir les réglages boutique" },
  { id: "settings.update", key: "settings.update", module: "Paramètres & Réglages", label: "Modifier les réglages & pixels" },
  { id: "notifications.view", key: "notifications.view", module: "Notifications", label: "Gérer les alertes" },
  { id: "audit_logs.view", key: "audit_logs.view", module: "Audit & Sécurité", label: "Consulter le journal d'audit" }
];

export default function AdminRolesPanel({ data, refresh }) {
  const items = (Array.isArray(data) ? data : []).filter(Boolean);
  const rawPermissions = (data && data[0]?.all_permissions?.length) ? data[0].all_permissions : SYSTEM_PERMISSIONS;
  
  // Normalize permissions so every entry has a valid id and module
  const permissions = rawPermissions.map(p => ({
    id: p.id || p.key,
    key: p.key || p.id,
    label: p.label || p.key || p.id,
    module: p.module || "Général"
  }));

  const [sidePanel, setSidePanel] = useState(null);
  const [users, setUsers] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", permission_ids: [] });
  const [error, setError] = useState("");

  const grouped = permissions.reduce((result, permission) => {
    (result[permission.module] ||= []).push(permission);
    return result;
  }, {});

  const openEditor = (role = null) => {
    setError("");
    setEditing(role);
    const selectedIds = (role?.permissions || []).map((p) => (typeof p === "string" ? p : p.id || p.key)).filter(Boolean);
    setForm({
      name: role?.name || "",
      description: role?.description || "",
      permission_ids: selectedIds
    });
    setEditorOpen(true);
  };

  const togglePermission = (id) => {
    setForm((current) => ({
      ...current,
      permission_ids: current.permission_ids.includes(id)
        ? current.permission_ids.filter((permissionId) => permissionId !== id)
        : [...current.permission_ids, id]
    }));
  };

  const toggleModule = (modulePermissions) => {
    const ids = modulePermissions.map((permission) => permission.id);
    const allSelected = ids.every((id) => form.permission_ids.includes(id));
    setForm((current) => ({
      ...current,
      permission_ids: allSelected
        ? current.permission_ids.filter((id) => !ids.includes(id))
        : [...new Set([...current.permission_ids, ...ids])]
    }));
  };

  const selectAll = () => {
    const allIds = permissions.map((p) => p.id);
    setForm((current) => ({ ...current, permission_ids: allIds }));
  };

  const deselectAll = () => {
    setForm((current) => ({ ...current, permission_ids: [] }));
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Veuillez saisir un nom pour le rôle.");
      return;
    }
    try {
      await request(editing ? `/api/admin/roles/${editing.id}` : "/api/admin/roles", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(form)
      });
      setEditorOpen(false);
      refresh();
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const duplicate = (role) => openEditor({ ...role, id: undefined, name: `${role.name}_COPY` });

  const remove = async (role) => {
    if (!window.confirm(`Supprimer le rôle ${role.name} ?`)) return;
    try {
      await request(`/api/admin/roles/${role.id}`, { method: "DELETE" });
      refresh();
    } catch (err) {
      alert(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  const showUsers = async (role) => {
    try {
      const result = await request(`/api/admin/roles/${role.id}/users`);
      setUsers(Array.isArray(result) ? result : []);
      setSidePanel({ ...role, showUsers: true });
    } catch (err) {
      setUsers([]);
      setSidePanel({ ...role, showUsers: true });
    }
  };

  const totalSelected = form.permission_ids.length;
  const totalAvailable = permissions.length;

  return (
    <section className="border border-border bg-background p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Sécurité & Accès</p>
          <h2 className="mt-1 font-heading text-2xl font-bold">Rôles & permissions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez des rôles sur mesure en sélectionnant précisément les permissions autorisées.
          </p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 bg-navy px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-navy/90"
        >
          <Plus className="h-4 w-4" />
          Nouveau rôle
        </button>
      </div>

      <div className="admin-list-scroll mt-6 divide-y divide-border border-y border-border">
        {items.map((role) => (
          <div key={role.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <strong className="text-base font-bold text-navy">{role.name}</strong>
              <p className="mt-1 text-xs text-muted-foreground">
                {role.description || "Aucune description"} · <span className="font-semibold text-foreground">{role.permissions?.length || 0}</span> permission{(role.permissions?.length || 0) > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => showUsers(role)}
                className="border border-border p-2 hover:bg-muted/50 transition-colors"
                aria-label={`Voir les utilisateurs de ${role.name}`}
                title="Voir les utilisateurs"
              >
                <Users className="h-4 w-4" />
              </button>
              <button
                onClick={() => duplicate(role)}
                className="border border-border p-2 hover:bg-muted/50 transition-colors"
                aria-label={`Dupliquer ${role.name}`}
                title="Dupliquer"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => openEditor(role)}
                className="border border-border p-2 hover:bg-muted/50 transition-colors"
                aria-label={`Modifier ${role.name}`}
                title="Modifier"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(role)}
                className="border border-border p-2 text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={`Supprimer ${role.name}`}
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!items.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun rôle enregistré.</p>}
      </div>

      <AdminModal
        open={editorOpen}
        size="2xl"
        title={editing ? `Modifier le rôle · ${editing.name}` : "Créer un nouveau rôle"}
        description="Composez les permissions du rôle en cochant les actions autorisées par module."
        onClose={() => setEditorOpen(false)}
      >
        <form onSubmit={save} className="grid gap-6 sm:grid-cols-[240px_1fr]">
          <div className="space-y-4">
            <div>
              <label className="admin-label">Nom du rôle</label>
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="ex: LOGISTIQUE, SUPPORT"
                className="w-full border border-border px-4 py-2.5 text-sm font-semibold uppercase tracking-wider"
              />
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Description et périmètre du rôle..."
                className="w-full resize-none border border-border px-4 py-2.5 text-sm"
                rows={4}
              />
            </div>

            <div className="rounded border border-border/80 bg-muted/20 p-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sélection globale</div>
              <div className="mt-1 text-sm font-bold text-navy">
                {totalSelected} / {totalAvailable} permissions
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="flex-1 border border-border bg-background py-1.5 text-[11px] font-bold uppercase hover:bg-muted"
                >
                  Tout cocher
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="flex-1 border border-border bg-background py-1.5 text-[11px] font-bold uppercase hover:bg-muted"
                >
                  Tout vider
                </button>
              </div>
            </div>

            {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}

            <button type="submit" className="w-full bg-navy py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-navy/90">
              {editing ? "Mettre à jour le rôle" : "Créer le rôle"}
            </button>
          </div>

          <div className="max-h-[55vh] space-y-4 overflow-y-auto overscroll-contain rounded-md border border-border bg-black/[0.015] p-3 pr-2">
            {Object.entries(grouped).map(([module, modulePermissions]) => {
              const allSelected = idsEverySelected(modulePermissions, form.permission_ids);
              const countSelected = modulePermissions.filter((p) => form.permission_ids.includes(p.id)).length;
              return (
                <fieldset key={module} className="rounded border border-border bg-background p-3.5 shadow-sm">
                  <legend className="px-2 text-[11px] font-bold uppercase tracking-wider text-navy">
                    {module}
                  </legend>
                  <div className="mb-2.5 flex items-center justify-between border-b border-border/60 pb-2">
                    <button
                      type="button"
                      onClick={() => toggleModule(modulePermissions)}
                      className="text-xs font-semibold text-navy hover:underline"
                    >
                      {allSelected ? "Tout décocher ce module" : "Tout cocher ce module"}
                    </button>
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {countSelected}/{modulePermissions.length}
                    </span>
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {modulePermissions.map((permission) => {
                      const isChecked = form.permission_ids.includes(permission.id);
                      return (
                        <label
                          key={permission.id}
                          className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                            isChecked ? "bg-navy/5 text-navy font-semibold" : "hover:bg-black/[0.03] text-foreground"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-navy h-4 w-4 cursor-pointer"
                            checked={isChecked}
                            onChange={() => togglePermission(permission.id)}
                          />
                          <span>{permission.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(sidePanel?.showUsers)}
        title={`Utilisateurs avec le rôle ${sidePanel?.name || ""}`}
        onClose={() => setSidePanel(null)}
      >
        <div className="divide-y divide-border border-y border-border">
          {users.map((user) => (
            <div key={user.id} className="py-3">
              <strong className="text-sm font-bold text-foreground">{user.name}</strong>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          ))}
          {!users.length && <p className="py-8 text-center text-sm text-muted-foreground">Aucun utilisateur assigné à ce rôle.</p>}
        </div>
      </AdminModal>
    </section>
  );
}

function idsEverySelected(modulePermissions, selectedIds) {
  return modulePermissions.every((permission) => selectedIds.includes(permission.id));
}