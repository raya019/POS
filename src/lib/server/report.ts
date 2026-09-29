import { db } from '$lib/server/db';
import { sales, products, user } from '$lib/server/db/schema';
import { eq, gte, lte, and, desc } from 'drizzle-orm';

export interface ReportRow {
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
	// Buat batasan waktu: dari jam 00:00:00 sampai 23:59:59 di waktu lokal
	const fromDate = new Date(`${from}T00:00:00`);
	const toDate = new Date(`${to}T23:59:59.999`);

	const salesData = await db.select({
		transactionCode: sales.transactionCode,
		productName: products.name,
		qty: sales.quantitySold,
		unitPrice: sales.unitPrice,
		discount: sales.discountAmount,
		total: sales.totalPaid,
		cashierName: user.name,
		soldAt: sales.soldAt
	})
	.from(sales)
	.innerJoin(products, eq(sales.productId, products.id))
	.innerJoin(user, eq(sales.cashierId, user.id))
	.where(
		and(
			gte(sales.soldAt, fromDate),
			lte(sales.soldAt, toDate)
		)
	)
	.orderBy(desc(sales.soldAt));

	return salesData.map(s => ({
		date: new Date(s.soldAt || new Date()).toLocaleString('id-ID', {
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit'
		}),
		transactionCode: s.transactionCode,
		productName: s.productName,
		qty: s.qty,
		unitPrice: s.unitPrice,
		discount: s.discount || 0,
		total: s.total,
		cashierName: s.cashierName
	}));
}
