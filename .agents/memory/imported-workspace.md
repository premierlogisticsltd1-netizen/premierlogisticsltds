---
name: Imported courier workspace
description: Durable setup decisions for the imported Swift Courier workspace.
---

The imported project is intentionally kept as its existing pnpm workspace: the React/Vite frontend and Express API remain separate services, with generated API packages and Drizzle schema left in place.

**Why:** The user asked to get the imported project running on Replit, not to migrate or restructure it.

**How to apply:** Preserve the workspace layout and existing stack when making future setup or feature changes. Treat the frontend typecheck errors as application work, not as a reason to replace the toolchain.