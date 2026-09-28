import { db } from "$lib/server/db";
import { voucherProducts } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Menghitung dan mendistribusikan diskon per item di keranjang belanja.
 * Jika voucher nominal, diskon didistribusikan secara proporsional.
 */
export async function calculateDiscountsPerItem(
	voucher: { id: number; discountType: "percent" | "nominal"; discountValue: number },
	cartItems: { productId: number; subtotal: number }[]
) {
	const restrictions = await db
		.select({ productId: voucherProducts.productId })
		.from(voucherProducts)
		.where(eq(voucherProducts.voucherId, voucher.id));

	const restrictedIds = new Set(restrictions.map((r) => r.productId));
	const eligibleItems = restrictedIds.size === 0 
		? cartItems 
		: cartItems.filter((i) => restrictedIds.has(i.productId));

	const eligibleSubtotal = eligibleItems.reduce((sum, i) => sum + i.subtotal, 0);
	
	const discounts = new Map<number, number>();
	if (eligibleSubtotal === 0) return discounts; // Tidak ada diskon jika tidak ada item yang memenuhi syarat

	if (voucher.discountType === "percent") {
		for (const item of eligibleItems) {
			const disc = Math.round((item.subtotal * voucher.discountValue) / 100);
			discounts.set(item.productId, disc);
		}
	} else {
		// Nominal: Distribusikan diskon nominal secara proporsional berdasar subtotal
		let remainingDiscount = voucher.discountValue;
		for (let i = 0; i < eligibleItems.length; i++) {
			const item = eligibleItems[i];
			if (i === eligibleItems.length - 1) {
				// Item terakhir mendapat sisa nominal diskon (maksimal sebesar subtotalnya)
				const disc = Math.min(item.subtotal, remainingDiscount);
				discounts.set(item.productId, disc);
			} else {
				const proportion = item.subtotal / eligibleSubtotal;
				const disc = Math.min(item.subtotal, Math.round(voucher.discountValue * proportion));
				discounts.set(item.productId, disc);
				remainingDiscount -= disc;
			}
		}
	}

	return discounts;
}
