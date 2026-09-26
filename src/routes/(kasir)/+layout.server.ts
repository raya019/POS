import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}
	
	// Semua user terautentikasi (admin_owner maupun kasir) bisa mengakses area kasir
	return {
		user: locals.user
	};
};
