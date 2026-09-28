import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import { user } from './schema';

// Menghindari virtual module SvelteKit ($env) saat dijalankan lewat CLI murni
const dbUrl = process.env.DATABASE_URL;
const authSecret = process.env.BETTER_AUTH_SECRET || 'secret';
const origin = process.env.ORIGIN || 'http://localhost:5173';

if (!dbUrl) throw new Error('DATABASE_URL must be set in environment');

const client = postgres(dbUrl);
const db = drizzle(client, { schema });

const auth = betterAuth({
	baseURL: origin,
	secret: authSecret,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true, requireEmailVerification: false },
	plugins: [username()],
	user: {
		additionalFields: {
			role: { type: 'string', required: true, defaultValue: 'kasir', input: false }
		}
	}
});

async function main() {
	console.log('Seeding first admin account...');
	try {
		await db.delete(schema.session);
		await db.delete(schema.account);
		await db.delete(schema.user);
		
		const res = await auth.api.signUpEmail({
			body: {
				email: 'admin@toko.local',
				username: 'admin',
				name: 'Admin Owner',
				password: 'password123'
			}
		});

		if (res?.user?.id) {
			await db
				.update(user)
				.set({ role: 'admin_owner' })
				.where(eq(user.id, res.user.id));
			console.log('✅ Admin account created successfully.');
			console.log('Username: admin');
			console.log('Password: password123');
		} else {
			console.error('Failed to create admin account.');
		}
	} catch (error) {
		console.error('Error during seeding:', error);
	}
	process.exit(0);
}

main();
