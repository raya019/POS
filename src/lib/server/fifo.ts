import { saleAllocations, stockEntries } from '$lib/server/db/schema';
import { and, asc, eq, gt } from 'drizzle-orm';

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
		throw new Error('Stok tidak mencukupi untuk produk ini');
	}

	return { updates, allocations };
}

export async function allocateStockFifo(
	tx: any,
	productId: number,
	saleId: number,
	quantityNeeded: number
) {
	const entries = await tx
		.select()
		.from(stockEntries)
		.where(and(eq(stockEntries.productId, productId), gt(stockEntries.quantityRemaining, 0)))
		.orderBy(asc(stockEntries.entryDate), asc(stockEntries.id));

	const { updates, allocations } = calculateFifoAllocations(entries, quantityNeeded);

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
