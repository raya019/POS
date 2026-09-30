import type { PageServerLoad } from './$types';
import { getSalesReport } from '$lib/server/report';
import type { ReportRow } from '$lib/server/report.ts';

export const load: PageServerLoad = async ({ url }) => {
	// Set rentang default (bulan ini)
	const today = new Date();
	const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
	const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
		.toISOString()
		.split('T')[0];

	const from = url.searchParams.get('from') || firstDay;
	const to = url.searchParams.get('to') || lastDay;

	const salesData: ReportRow[] = await getSalesReport(from, to);

	// Hitung agregasi untuk metrik ringkasan
	const summary = {
		totalRevenue: salesData.reduce((sum, s) => sum + s.total, 0),
		totalItems: salesData.reduce((sum, s) => sum + s.qty, 0),
		totalTransactions: new Set(salesData.map((s) => s.transactionCode)).size,
		totalDiscount: salesData.reduce((sum, s) => sum + s.discount, 0)
	};

	return {
		from,
		to,
		salesData,
		summary
	};
};
