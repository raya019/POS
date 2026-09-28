import { describe, it, expect } from "bun:test";
import { calculateFifoAllocations } from "./fifo";

describe("FIFO Logic (calculateFifoAllocations)", () => {
	it("mengambil dari 1 entri tunggal ketika stok cukup", () => {
		const entries = [{ id: 1, quantityRemaining: 10 }];
		const result = calculateFifoAllocations(entries, 3);
		
		expect(result.updates).toEqual([{ id: 1, newQuantity: 7 }]);
		expect(result.allocations).toEqual([{ stockEntryId: 1, quantityTaken: 3 }]);
	});

	it("memotong stok parsial yang tersebar di lebih dari 1 entri secara FIFO", () => {
		const entries = [
			{ id: 1, quantityRemaining: 2 },
			{ id: 2, quantityRemaining: 5 },
			{ id: 3, quantityRemaining: 10 }
		];
		
		// Butuh 6 -> ambil 2 dari entri 1, ambil 4 dari entri 2
		const result = calculateFifoAllocations(entries, 6);
		
		expect(result.updates).toEqual([
			{ id: 1, newQuantity: 0 },
			{ id: 2, newQuantity: 1 }
		]);
		expect(result.allocations).toEqual([
			{ stockEntryId: 1, quantityTaken: 2 },
			{ stockEntryId: 2, quantityTaken: 4 }
		]);
	});

	it("melempar Error jika total stok tidak mencukupi", () => {
		const entries = [
			{ id: 1, quantityRemaining: 2 },
			{ id: 2, quantityRemaining: 1 }
		];
		
		// Butuh 5, sedangkan total hanya 3
		expect(() => calculateFifoAllocations(entries, 5)).toThrowError("Stok tidak mencukupi");
	});
});
