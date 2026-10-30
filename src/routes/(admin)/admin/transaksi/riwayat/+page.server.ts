import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/index.js';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const todayStr = new Date().toLocaleDateString('en-CA');

	const from = url.searchParams.get('from') || todayStr;
	const to = url.searchParams.get('to') || todayStr;

	const historyData = await db.execute(sql`
		SELECT s.id, s.transaction_code, s.sold_at, u.name as cashier_name,
			   SUM(s.quantity_sold) as total_items, SUM(s.total_paid) as total_amount
		FROM sales s
		JOIN "user" u ON s.cashier_id = u.id
		WHERE DATE(s.sold_at) >= ${from}::date AND DATE(s.sold_at) <= ${to}::date
		GROUP BY s.id, s.transaction_code, s.sold_at, u.name
		ORDER BY s.sold_at DESC
	`);

	return { history: historyData, from, to };
};
