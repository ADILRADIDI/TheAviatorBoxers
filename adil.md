# WORK L — Reste à terminer

## 1. Tests de sécurité par rôle

- Tests de politique `403` et mapping des permissions ajoutés (`12 tests API` au total).
- Endpoints de permissions et middleware utilisent maintenant la même politique testée.
- Reste : tests d’intégration avec comptes DB `ADMIN`, `SALES`, `WAREHOUSE`, `MARKETING` et `CONTENT_EDITOR`.
- Tester expiration, révocation et réutilisation de session.
- Ajouter les tests Playwright de navigation conditionnelle et `/admin/roles`.

## 2. Monitoring et logs

- Logs structurés JSON ajoutés avec request id, route, statut, durée et utilisateur.
- Endpoints `/health`, `/ready` et `/metrics` ajoutés; métriques HTTP de base exposées au format Prometheus.
- Reste : métriques PostgreSQL, Redis et stockage média, alertes externes.
- Ajouter alertes sur erreurs 5xx, échecs de login et stockage presque plein.

## 3. Backup et rollback PostgreSQL

- Backup disponible via `scripts/backup-postgres.sh`.
- Restauration disponible via `scripts/restore-postgres.sh` avec confirmation obligatoire `CONFIRM_RESTORE=YES`.
- Reste : tester une restauration sur une base vierge, ajouter rétention/vérification d’intégrité et documenter le rollback Drizzle.

## 4. Docker production

- Exécuter `docker compose up --build` de bout en bout.
- Vérifier API, frontend, PostgreSQL, Redis et volume média.
- Ajouter healthchecks API et dépendances de démarrage robustes.
- Tester migrations et seed dans un environnement Docker vierge.

## 5. CI réelle et secrets

- Vérifier la CI sur un runner GitHub réel.
- Ajouter migrations/tests E2E dans la CI avec services PostgreSQL et Redis.
- Les fallbacks admin ont été supprimés; les placeholders sont documentés dans `.env.example`.
- Reste : vérifier tous les secrets Docker et la CI sur un runner GitHub réel.
- Documenter `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `MEDIA_ROOT` et les secrets CI.