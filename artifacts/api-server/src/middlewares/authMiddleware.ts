import { getAuth } from '@clerk/express';
import { type NextFunction, type Request, type Response } from 'express';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

type LocalUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): this is AuthedRequest;
      user?: LocalUser;
    }
    export interface AuthedRequest extends Request {
      user: LocalUser;
    }
  }
}

/**
 * JIT-provision the local user row when a Clerk userId is first seen.
 * On conflict (user already exists) just returns the existing row.
 */
async function getOrProvisionUser(userId: string): Promise<LocalUser> {
  // Try to find existing user first
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (existing) return existing as LocalUser;

  // First sign-in — create a placeholder row. Role defaults to 'customer'.
  const [created] = await db
    .insert(usersTable)
    .values({
      id: userId,
      email: null,
      firstName: null,
      lastName: null,
      profileImageUrl: null,
    })
    .onConflictDoNothing()
    .returning();

  return (created as LocalUser) ?? {
    id: userId,
    email: null,
    firstName: null,
    lastName: null,
    profileImageUrl: null,
    role: 'customer',
  };
}

/**
 * Require a signed-in Clerk session. Sets req.user from the DB (JIT provisioning).
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const user = await getOrProvisionUser(userId);
  req.user = user;
  req.isAuthenticated = function(this: Request) { return true; } as Request['isAuthenticated'];
  next();
}

/**
 * Require a signed-in user whose DB role is one of the given roles.
 */
export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const user = await getOrProvisionUser(userId);
    req.user = user;
    req.isAuthenticated = function(this: Request) { return true; } as Request['isAuthenticated'];
    if (!roles.includes(user.role ?? '')) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
