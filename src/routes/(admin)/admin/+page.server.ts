import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

interface CriticalStock {
	name: string;
	code: string;
	total_qty: number;
}

export const load: PageServerLoad = async () => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	// Penjualan hari ini
	const salesTodayResult = await db.execute(sql`
		SELECT COALESCE(SUM(total_paid), 0) as total 
		FROM sales 
		WHERE sold_at >= ${today.toISOString()}
	`);

	// Transaksi bulan ini (count distinct)
	const transactionsMonthResult = await db.execute(sql`
		SELECT COUNT(DISTINCT transaction_code) as count
		FROM sales
		WHERE sold_at >= ${firstDayOfMonth.toISOString()}
	`);

	// Voucher aktif
	const activeVouchersResult = await db.execute(sql`
		SELECT COUNT(*) as count FROM vouchers
		WHERE (valid_until IS NULL OR valid_until >= CURRENT_DATE)
	`);

	// Stok Kritis (< 5)
	const criticalStocks = await db.execute(sql`
		SELECT p.name, p.code, COALESCE(SUM(se.quantity_remaining), 0) as total_qty
		FROM products p
		LEFT JOIN stock_entries se ON p.id = se.product_id
		GROUP BY p.id, p.name, p.code
		HAVING COALESCE(SUM(se.quantity_remaining), 0) < 5
		ORDER BY total_qty ASC
	`);

	return {
		salesToday: Number(salesTodayResult[0]?.total || 0),
		transactionsThisMonth: Number(transactionsMonthResult[0]?.count || 0),
		activeVouchers: Number(activeVouchersResult[0]?.count || 0),
		criticalStocks: criticalStocks as CriticalStock[]
	};
};
