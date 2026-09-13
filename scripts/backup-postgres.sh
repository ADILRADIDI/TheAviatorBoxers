#!/usr/bin/env sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
output_dir="${BACKUP_DIR:-./backups}"
mkdir -p "$output_dir"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
pg_dump "$DATABASE_URL" --format=custom --file="$output_dir/aviator-$timestamp.dump"
printf 'Backup created: %s\n' "$output_dir/aviator-$timestamp.dump"
