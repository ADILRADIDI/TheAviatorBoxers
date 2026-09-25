import { useState } from "react";
import { Copy, Pencil, Plus, Trash2, Users } from "lucide-react";
import AdminModal from "./AdminModal";

import { adminRequest as request } from "@/lib/adminApi";

export default function AdminRolesPanel({ data, refresh }) {
  const items = (Array.isArray(data) ? data : []).filter(Boolean);
  const permissions = data[0]?.all_permissions || [];
  const [sidePanel, setSidePanel] = useState(null);
  const [users, setUsers] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", permission_ids: [] });
  const [error, setError] = useState("");
  const grouped = permissions.reduce((result, permission) => { (result[permission.module] ||= []).push(permission); return result; }, {});

  const openEditor = (role = null) => {
    setError("");
    setEditing(role);
    setForm({ name: role?.name || "", description: role?.description || "", permission_ids: role?.permissions?.map((permission) => permission.id) || [] });
    setEditorOpen(true);
  };
  const togglePermission = (id) => setForm((current) => ({ ...current, permission_ids: current.permission_ids.includes(id) ? current.permission_ids.filter((permissionId) => permissionId !== id) : [...current.permission_ids, id] }));
  const toggleModule = (modulePermissions) => {
    const ids = modulePermissions.map((permission) => permission.id);
    const allSelected = ids.every((id) => form.permission_ids.includes(id));
    setForm((current) => ({ ...current, permission_ids: allSelected ? current.permission_ids.filter((id) => !ids.includes(id)) : [...new Set([...current.permission_ids, ...ids])] }));
  };
  const save = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await request(editing ? `/api/admin/roles/${editing.id}` : "/api/admin/roles", { method: editing ? "PATCH" : "POST", body: JSON.stringify(form) });
      setEditorOpen(false);
      refresh();
    } catch (saveError) { setError(saveError.message); }
  };
  const duplicate = (role) => openEditor({ ...role, id: undefined, name: `${role.name}_COPY` });
  const remove = async (role) => { if (!window.confirm(`Supprimer le rôle ${role.name} ?`)) return; await request(`/api/admin/roles/${role.id}`, { method: "DELETE" }); refresh(); };
  const showUsers = async (role) => { const result = await request(`/api/admin/roles/${role.id}/users`); setUsers(result); setSidePanel({ ...role, showUsers: true }); };

  return <section className="border border-border bg-background p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Sécurité</p><h2 className="mt-1 font-heading text-2xl font-bold">Rôles & permissions</h2><p className="mt-2 text-sm text-muted-foreground">Les permissions sont vérifiées côté API pour chaque action.</p></div><button onClick={() => openEditor()} className="flex items-center gap-2 bg-navy px-4 py-3 text-xs font-bold uppercase text-white"><Plus className="h-4 w-4" />Nouveau rôle</button></div>
    <div className="admin-list-scroll mt-6 divide-y divide-border border-y border-border">{items.map((role) => <div key={role.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><strong>{role.name}</strong><p className="mt-1 text-xs text-muted-foreground">{role.description || "Aucune description"} · {role.permissions?.length || 0} permissions</p></div><div className="flex gap-2"><button onClick={() => showUsers(role)} className="border border-border p-2" aria-label={`Voir les utilisateurs de ${role.name}`}><Users className="h-4 w-4" /></button><button onClick={() => duplicate(role)} className="border border-border p-2" aria-label={`Dupliquer ${role.name}`}><Copy className="h-4 w-4" /></button><button onClick={() => openEditor(role)} className="border border-border p-2" aria-label={`Modifier ${role.name}`}><Pencil className="h-4 w-4" /></button><button onClick={() => remove(role)} className="border border-border p-2 text-destructive" aria-label={`Supprimer ${role.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}{!items.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun rôle.</p>}</div>
    <AdminModal open={editorOpen} size="2xl" title={editing ? `Modifier ${editing.name}` : "Créer un rôle"} description="Attribuez des permissions par module — chaque action est contrôlée côté serveur." onClose={() => setEditorOpen(false)}><form onSubmit={save} className="grid gap-5 sm:grid-cols-[240px_1fr]"><div className="space-y-4"><div><label className="admin-label">Nom du rôle</label><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="ex: WAREHOUSE" className="w-full border border-border px-4 py-3 text-sm uppercase" /></div><div><label className="admin-label">Description</label><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description du rôle" className="w-full resize-none border border-border px-4 py-3 text-sm" rows={4} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button className="w-full bg-navy py-3 text-xs font-bold uppercase text-white">Enregistrer</button></div><div className="max-h-[46vh] space-y-3 overflow-y-auto overscroll-contain rounded-md border border-border bg-black/[0.015] p-3">{Object.entries(grouped).map(([module, modulePermissions]) => <fieldset key={module} className="border border-border bg-background p-4"><legend className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{module}</legend><div className="mb-3 flex items-center justify-between"><button type="button" onClick={() => toggleModule(modulePermissions)} className="text-xs font-semibold text-navy underline underline-offset-2">{idsEverySelected(modulePermissions, form.permission_ids) ? "Tout retirer" : "Tout sélectionner"}</button><span className="text-[10px] text-muted-foreground">{modulePermissions.filter((permission) => form.permission_ids.includes(permission.id)).length}/{modulePermissions.length}</span></div><div className="grid gap-1.5 sm:grid-cols-2">{modulePermissions.map((permission) => <label key={permission.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-black/[0.03]"><input type="checkbox" className="accent-navy h-4 w-4" checked={form.permission_ids.includes(permission.id)} onChange={() => togglePermission(permission.id)} />{permission.label}</label>)}</div></fieldset>)}</div></form></AdminModal>
    <AdminModal open={Boolean(sidePanel?.showUsers)} title={`Utilisateurs · ${sidePanel?.name || ""}`} onClose={() => setSidePanel(null)}><div className="divide-y divide-border border-y border-border">{users.map((user) => <div key={user.id} className="py-3"><strong>{user.name}</strong><p className="text-xs text-muted-foreground">{user.email}</p></div>)}{!users.length && <p className="py-8 text-center text-sm text-muted-foreground">Aucun utilisateur assigné.</p>}</div></AdminModal>
  </section>;
}

function idsEverySelected(modulePermissions, selectedIds) {
  return modulePermissions.every((permission) => selectedIds.includes(permission.id));
}