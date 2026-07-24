---
name: Managed artifact workflows
description: Workflow choice for the imported courier app.
---

The imported workspace contains artifact metadata, but its services were not registered in the workflow registry, so it currently runs through two explicit workflows: one web workflow for React/Vite and one API workflow for Express.

**Why:** The imported artifact registry was empty, and starting the commands without their required environment caused both services to fail before opening ports.

**How to apply:** Preserve the existing workflow names and required values: web uses `PORT=22333 BASE_PATH=/`, API uses `PORT=8080`. Do not add duplicate services on those ports.