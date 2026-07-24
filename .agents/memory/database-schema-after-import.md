---
name: Database schema after import
description: Imported workspaces can have the Drizzle schema in code while the development PostgreSQL database is still empty.
---

After importing or restoring this workspace, authentication may fail during the OIDC callback if the development database has not been synchronized with the Drizzle schema. The callback requires both `users` and `sessions`, and the application does not create them at startup.

**Why:** The first authenticated login reaches the local user upsert, so an unsynchronized database presents as a generic login failure rather than a missing-schema setup issue.

**How to apply:** When auth fails at `upsertUser` with a database query error, inspect `information_schema` first and run the existing development schema push before changing auth code. Production schema changes follow the publish flow.