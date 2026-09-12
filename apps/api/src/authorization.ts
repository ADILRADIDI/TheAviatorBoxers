export function permissionFor(url: string, method: string) {
  const path = url.split("?")[0].replace(/^\/api\/admin\/?/, "");
  const resource = path.split("/")[0];
  if (resource === "logout") return null;
  if (resource === "roles") return method === "GET" ? "roles.view" : method === "POST" ? "roles.create" : method === "DELETE" ? "roles.delete" : "roles.update";
  if (resource === "users") return method === "GET" ? "users.view" : method === "POST" ? "users.create" : method === "DELETE" ? "users.delete" : "users.update";
  if (resource === "permissions") return "roles.view";
  if (resource === "dashboard") return "dashboard.view";
  if (resource === "orders") return method === "GET" ? "orders.view" : method === "DELETE" ? "orders.cancel" : "orders.update";
  if (resource === "products") return method === "GET" ? "products.view" : method === "POST" ? "products.create" : method === "DELETE" ? "products.delete" : "products.update";
  if (resource === "inventory") return method === "GET" ? "inventory.view" : "inventory.adjust";
  if (resource === "categories") return method === "GET" ? "categories.view" : method === "POST" ? "categories.create" : method === "DELETE" ? "categories.delete" : "categories.update";
  if (resource === "coupons") return method === "GET" ? "discounts.view" : method === "POST" ? "discounts.create" : method === "DELETE" ? "discounts.delete" : "discounts.update";
  if (resource === "promotions") return method === "GET" ? "promotions.view" : method === "POST" ? "promotions.create" : method === "DELETE" ? "promotions.delete" : "promotions.update";
  if (resource === "cms") return method === "GET" ? "cms.view" : method === "POST" ? "cms.create" : method === "DELETE" ? "cms.delete" : "cms.update";
  if (resource === "media") return method === "GET" ? "media.view" : method === "POST" ? "media.upload" : "media.delete";
  if (resource === "audit-logs") return "audit_logs.view";
  if (resource === "notifications") return "notifications.view";
  if (resource === "exports") return "reports.export";
  if (resource === "payment-methods") return method === "GET" ? "payments.view" : "payments.update";
  if (resource === "settings") return method === "GET" ? "settings.view" : "settings.update";
  return method === "GET" ? `${resource}.view` : `${resource}.update`;
}

export function canAccess(granted: string[], required: string | null) {
  return !required || granted.includes(required);
}
