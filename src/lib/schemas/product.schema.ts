import { z } from 'zod';

export const productSchema = z.object({
	code: z.string().min(1, 'Kode wajib diisi').max(20),
	name: z.string().min(1, 'Nama wajib diisi').max(100),
	brand: z.string().min(1, 'Merek wajib diisi').max(50),
	size: z.string().min(1, 'Ukuran wajib diisi').max(10),
	color: z.string().min(1, 'Warna wajib diisi').max(30),
	buyPrice: z.number().int().positive('Harga beli harus > 0'),
	sellPrice: z.number().int().positive('Harga jual harus > 0')
});

export type ProductSchema = z.infer<typeof productSchema>;
