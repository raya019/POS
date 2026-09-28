import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	// Memanggil fungsi signOut bawaan dari better-auth
	await auth.api.signOut({
		headers: event.request.headers
	});

	// Langsung redirect ke halaman login
	throw redirect(302, '/login');
};
