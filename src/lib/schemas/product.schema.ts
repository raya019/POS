import { z } from 'zod';

export const productSchema = z.object({
	code: z.string().min(1, 'Kode wajib diisi').max(20),
	name: z.string().min(1, 'Nama wajib diisi').max(100),
	brand: z.string().max(50).optional(),
	size: z.string().max(10).optional(),
	buyPrice: z.number().int().positive('Harga beli harus > 0'),
	sellPrice: z.number().int().positive('Harga jual harus > 0'),
	barcode: z.string().max(50).optional().nullable()
});

export type ProductSchema = z.infer<typeof productSchema>;
