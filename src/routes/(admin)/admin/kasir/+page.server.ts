import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const users = await db.select().from(user).where(eq(user.role, 'kasir'));
	return { users };
};
