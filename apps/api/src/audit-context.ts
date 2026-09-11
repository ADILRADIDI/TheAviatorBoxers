import { AsyncLocalStorage } from "node:async_hooks";

export type AuditContext = {
  userId?: string;
  actor?: string;
  permission?: string | null;
  ipAddress?: string;
  userAgent?: string;
};

export const auditContext = new AsyncLocalStorage<AuditContext>();
