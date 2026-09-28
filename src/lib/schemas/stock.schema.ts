import { z } from 'zod';

export const stockEntrySchema = z.object({
	productId: z.number().int().positive('Produk wajib dipilih'),
	quantityIn: z.number().int().positive('Jumlah harus lebih besar dari 0'),
	entryDate: z.string().min(1, 'Tanggal masuk wajib diisi') // misal "2026-09-27"
});

export type StockEntrySchema = z.infer<typeof stockEntrySchema>;
