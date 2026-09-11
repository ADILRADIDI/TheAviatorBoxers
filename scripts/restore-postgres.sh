#!/usr/bin/env sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
: "${BACKUP_FILE:?BACKUP_FILE is required}"
if [ "${CONFIRM_RESTORE:-}" != "YES" ]; then
  echo "Refusing restore: set CONFIRM_RESTORE=YES to replace database contents." >&2
  exit 2
fi
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" "$BACKUP_FILE"
printf 'Restore completed from: %s\n' "$BACKUP_FILE"
