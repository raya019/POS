import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const todayStr = new Date().toISOString().split('T')[0];
	const from = url.searchParams.get('from') || todayStr;
	const to = url.searchParams.get('to') || todayStr;

	const fromDate = new Date(`${from}T00:00:00`).toISOString();
	const toDate = new Date(`${to}T23:59:59.999`).toISOString();

	const historyData = await db.execute(sql`
		SELECT s.transaction_code, s.sold_at, u.name as cashier_name,
			   SUM(s.quantity_sold) as total_items, SUM(s.total_paid) as total_amount
		FROM sales s
		JOIN "user" u ON s.cashier_id = u.id
		WHERE s.sold_at >= ${fromDate} AND s.sold_at <= ${toDate}
		GROUP BY s.transaction_code, s.sold_at, u.name
		ORDER BY s.sold_at DESC
	`);

	return { history: historyData, from, to };
};
