import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Mengambil ringkasan transaksi, di-group berdasar transactionCode
	const historyData = await db.execute(sql`
		SELECT s.transaction_code, s.sold_at, u.name as cashier_name,
			   SUM(s.quantity_sold) as total_items, SUM(s.total_paid) as total_amount
		FROM sales s
		JOIN "user" u ON s.cashier_id = u.id
		GROUP BY s.transaction_code, s.sold_at, u.name
		ORDER BY s.sold_at DESC
	`);

	return { history: historyData as any[] };
};
