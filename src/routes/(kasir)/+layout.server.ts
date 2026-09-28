import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	
	// Secara umum admin juga bisa mengakses kasir jika mau, 
	// tapi kita bebaskan sementara atau batasi strict sesuai butuh.
	// Di POS ini, admin bebas mengakses.
	return {};
};
