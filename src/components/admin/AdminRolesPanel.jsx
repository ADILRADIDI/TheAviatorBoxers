import { useState } from "react";
import { Copy, Pencil, Plus, Trash2, Users } from "lucide-react";
import AdminModal from "./AdminModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json", "x-admin-token": localStorage.getItem("aviator_admin_token") || "" }, ...options });
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
}

export default function AdminRolesPanel({ data, refresh }) {
  const permissions = data[0]?.all_permissions || [];
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", permission_ids: [] });
  const [error, setError] = useState("");
  const grouped = permissions.reduce((result, permission) => { (result[permission.module] ||= []).push(permission); return result; }, {});

  const openEditor = (role = null) => {
    setError("");
    setSelected(role);
    setForm({ name: role?.name || "", description: role?.description || "", permission_ids: role?.permissions?.map((permission) => permission.id) || [] });
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
      await request(selected ? `/api/admin/roles/${selected.id}` : "/api/admin/roles", { method: selected ? "PATCH" : "POST", body: JSON.stringify(form) });
      setSelected(null);
      refresh();
    } catch (saveError) { setError(saveError.message); }
  };
  const duplicate = (role) => openEditor({ ...role, id: undefined, name: `${role.name}_COPY` });
  const remove = async (role) => { if (!window.confirm(`Supprimer le rôle ${role.name} ?`)) return; await request(`/api/admin/roles/${role.id}`, { method: "DELETE" }); refresh(); };
  const showUsers = async (role) => { const result = await request(`/api/admin/roles/${role.id}/users`); setUsers(result); setSelected({ ...role, showUsers: true }); };

  return <section className="border border-border bg-background p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Sécurité</p><h2 className="mt-1 font-display text-2xl font-bold">Rôles & permissions</h2><p className="mt-2 text-sm text-muted-foreground">Les permissions sont vérifiées côté API pour chaque action.</p></div><button onClick={() => openEditor()} className="flex items-center gap-2 bg-navy px-4 py-3 text-xs font-bold uppercase text-white"><Plus className="h-4 w-4" />Nouveau rôle</button></div>
    <div className="mt-6 divide-y divide-border border-y border-border">{data.map((role) => <div key={role.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><strong>{role.name}</strong><p className="mt-1 text-xs text-muted-foreground">{role.description || "Aucune description"} · {role.permissions?.length || 0} permissions</p></div><div className="flex gap-2"><button onClick={() => showUsers(role)} className="border border-border p-2" aria-label={`Voir les utilisateurs de ${role.name}`}><Users className="h-4 w-4" /></button><button onClick={() => duplicate(role)} className="border border-border p-2" aria-label={`Dupliquer ${role.name}`}><Copy className="h-4 w-4" /></button><button onClick={() => openEditor(role)} className="border border-border p-2" aria-label={`Modifier ${role.name}`}><Pencil className="h-4 w-4" /></button><button onClick={() => remove(role)} className="border border-border p-2 text-destructive" aria-label={`Supprimer ${role.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}{!data.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun rôle.</p>}</div>
    <AdminModal open={Boolean(selected) && !selected.showUsers} title={selected ? `Modifier ${selected.name}` : "Créer un rôle"} onClose={() => setSelected(null)}><form onSubmit={save} className="space-y-5"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nom du rôle" className="w-full border border-border px-4 py-3 text-sm uppercase" /><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="w-full border border-border px-4 py-3 text-sm" />{Object.entries(grouped).map(([module, modulePermissions]) => <fieldset key={module} className="border border-border p-4"><legend className="px-2 text-xs font-bold uppercase tracking-wider">{module}</legend><button type="button" onClick={() => toggleModule(modulePermissions)} className="mb-3 text-xs underline">Tout sélectionner</button><div className="grid gap-2 sm:grid-cols-2">{modulePermissions.map((permission) => <label key={permission.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.permission_ids.includes(permission.id)} onChange={() => togglePermission(permission.id)} />{permission.label}</label>)}</div></fieldset>)}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button className="w-full bg-navy py-3 text-xs font-bold uppercase text-white">Enregistrer</button></form></AdminModal>
    <AdminModal open={Boolean(selected?.showUsers)} title={`Utilisateurs · ${selected?.name || ""}`} onClose={() => setSelected(null)}><div className="divide-y divide-border border-y border-border">{users.map((user) => <div key={user.id} className="py-3"><strong>{user.name}</strong><p className="text-xs text-muted-foreground">{user.email}</p></div>)}{!users.length && <p className="py-8 text-center text-sm text-muted-foreground">Aucun utilisateur assigné.</p>}</div></AdminModal>
  </section>;
}
