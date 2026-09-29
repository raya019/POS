import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sales, products, user, vouchers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const trxCode = params.code;

	const salesData = await db
		.select({
			sale: sales,
			product: products,
			cashier: user,
			voucher: vouchers
		})
		.from(sales)
		.innerJoin(products, eq(sales.productId, products.id))
		.innerJoin(user, eq(sales.cashierId, user.id))
		.leftJoin(vouchers, eq(sales.voucherId, vouchers.id))
		.where(eq(sales.transactionCode, trxCode));

	if (!salesData.length) {
		error(404, 'Transaksi tidak ditemukan');
	}

	const cashierName = salesData[0].cashier.name;
	const transactionDate = salesData[0].sale.soldAt;
	const voucherUsed = salesData[0].voucher?.code;

	let totalSubtotal = 0;
	let totalDiscount = 0;

	const items = salesData.map(row => {
		const subtotal = row.sale.unitPrice * row.sale.quantitySold;
		totalSubtotal += subtotal;
		totalDiscount += row.sale.discountAmount || 0;
		return {
			productName: row.product.name,
			qty: row.sale.quantitySold,
			unitPrice: row.sale.unitPrice,
			discount: row.sale.discountAmount,
			totalPaid: row.sale.totalPaid
		};
	});

	const grandTotal = totalSubtotal - totalDiscount;

	return {
		transactionCode: trxCode,
		cashierName,
		transactionDate,
		items,
		totalSubtotal,
		totalDiscount,
		grandTotal,
		voucherUsed
	};
};
