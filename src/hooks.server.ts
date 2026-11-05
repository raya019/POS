import { auth } from '$lib/server/auth';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	event.locals.user = session?.user || undefined;
	event.locals.session = session?.session || undefined;

	return resolve(event);
};

export const handleError: HandleServerError = ({ error, event, status }) => {
	if (status === 404) {
		return { message: 'Halaman atau data yang Anda cari tidak ditemukan.' };
	}

	console.error(`[${event.route.id}]`, error);
	return { message: 'Terjadi kesalahan pada server. Coba lagi atau hubungi admin.' };
};
