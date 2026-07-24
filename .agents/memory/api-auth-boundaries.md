---
name: API auth boundaries
description: Staff logistics APIs require sessions while public health and tracking endpoints remain unauthenticated.
---

The API must enforce authentication at the route boundary, not only in the React UI. Dashboard, shipment CRUD, and shipment event endpoints are staff-only; health, auth-state, and tracking-by-number are public.

**Why:** UI-only protection allowed unauthenticated callers to access operational data and mutations, while an unscoped router middleware accidentally blocked public tracking.

**How to apply:** Keep `requireAuth` scoped to the staff route prefixes and rerun both unauthenticated 401 checks and public tracking checks after changing API router order.