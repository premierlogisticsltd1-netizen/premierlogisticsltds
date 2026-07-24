---
name: Managed artifact workflows
description: Workflow choice for the imported courier app.
---

The project should run through its registered artifact-owned services: one web workflow for the React/Vite app and one API workflow for Express. Legacy duplicate workflows should remain removed.

**Why:** Two API processes on the same port caused an address-in-use failure when the managed API service restarted.

**How to apply:** Restart the exact managed workflow names shown by the workflow registry. Do not recreate separate legacy workflows for the same artifact services.