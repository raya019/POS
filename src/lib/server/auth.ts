import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { username } from 'better-auth/plugins';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true, requireEmailVerification: false, autoSignIn: false },
	plugins: [username(), sveltekitCookies(getRequestEvent)],
	user: {
		additionalFields: {
			role: { type: 'string', required: true, defaultValue: 'kasir', input: false }
		}
	}
});
