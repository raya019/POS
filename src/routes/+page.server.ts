import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	if (locals.user.role === 'admin_owner') {
		redirect(302, '/admin');
	} else {
		redirect(302, '/transaksi');
	}
};
