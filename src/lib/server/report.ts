import { db } from '$lib/server/db';
import { sales, products, user } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { formatDate } from '$lib/shared/helper';

export interface ReportRow {
	id: number;
	date: string;
	transactionCode: string;
	productName: string;
	qty: number;
	unitPrice: number;
	discount: number;
	total: number;
	cashierName: string;
}

export async function getSalesReport(from: string, to: string): Promise<ReportRow[]> {
	const salesData = await db
		.select({
			id: sales.id,
			transactionCode: sales.transactionCode,
			productName: products.name,
			qty: sales.quantitySold,
			unitPrice: sales.unitPrice,
			discount: sales.discountAmount,
			total: sales.totalPaid,
			cashierName: user.name,
			soldAt: sql<string>`${sales.soldAt}::text`
		})
		.from(sales)
		.innerJoin(products, eq(sales.productId, products.id))
		.innerJoin(user, eq(sales.cashierId, user.id))
		.where(sql`DATE(${sales.soldAt}) >= ${from}::date AND DATE(${sales.soldAt}) <= ${to}::date`)
		.orderBy(desc(sales.soldAt));

	return salesData.map((s) => ({
		id: s.id,
		date: formatDate(s.soldAt),
		transactionCode: s.transactionCode,
		productName: s.productName,
		qty: s.qty,
		unitPrice: s.unitPrice,
		discount: s.discount || 0,
		total: s.total,
		cashierName: s.cashierName
	}));
}
