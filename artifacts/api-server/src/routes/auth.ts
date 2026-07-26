/**
 * Auth routes — Clerk handles the browser auth flow via its JS SDK and
 * the proxy mounted at /api/__clerk. This file keeps the /api/auth/user
 * endpoint for backwards compatibility (returns current user or null).
 */
import { Router, type IRouter, type Request, type Response } from 'express';
import { getAuth } from '@clerk/express';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();

router.get('/auth/user', async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.json({ user: null });
    return;
  }
  const [user] = await db
    .select({ id: usersTable.id, email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName, role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  res.json({ user: user ?? null });
});

export default router;
