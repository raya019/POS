import { db } from "$lib/server/db";
import { stockEntries, saleAllocations } from "$lib/server/db/schema";
import { eq, and, gt, asc } from "drizzle-orm";

/**
 * Pure function untuk menghitung alokasi FIFO secara fungsional.
 * Memudahkan proses Unit Testing tanpa mock database kompleks.
 */
export function calculateFifoAllocations(
	entries: { id: number; quantityRemaining: number }[],
	quantityNeeded: number
) {
	let remaining = quantityNeeded;
	const updates: { id: number; newQuantity: number }[] = [];
	const allocations: { stockEntryId: number; quantityTaken: number }[] = [];

	for (const entry of entries) {
		if (remaining <= 0) break;

		const taken = Math.min(entry.quantityRemaining, remaining);

		updates.push({
			id: entry.id,
			newQuantity: entry.quantityRemaining - taken
		});

		allocations.push({
			stockEntryId: entry.id,
			quantityTaken: taken
		});

		remaining -= taken;
	}

	if (remaining > 0) {
		throw new Error("Stok tidak mencukupi untuk produk ini");
	}

	return { updates, allocations };
}

/**
 * Fungsi utama untuk dialokasikan bersama transaksi kasir.
 */
export async function allocateStockFifo(
	tx: any, // Parameter tx disesuaikan saat checkout dengan Drizzle transaction instance
	productId: number,
	saleId: number,
	quantityNeeded: number
) {
	const entries = await tx
		.select()
		.from(stockEntries)
		.where(and(eq(stockEntries.productId, productId), gt(stockEntries.quantityRemaining, 0)))
		.orderBy(asc(stockEntries.entryDate), asc(stockEntries.id)); // urutkan berdasar tanggal, lalu ID sebagai pemecah seri

	const { updates, allocations } = calculateFifoAllocations(entries, quantityNeeded);

	// Terapkan hasil perhitungan ke database
	for (const update of updates) {
		await tx
			.update(stockEntries)
			.set({ quantityRemaining: update.newQuantity })
			.where(eq(stockEntries.id, update.id));
	}

	for (const alloc of allocations) {
		await tx.insert(saleAllocations).values({
			saleId,
			stockEntryId: alloc.stockEntryId,
			quantityTaken: alloc.quantityTaken
		});
	}
}
