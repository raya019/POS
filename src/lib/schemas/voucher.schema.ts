import { z } from 'zod';

export const voucherSchema = z.object({
	code: z.string().min(1, 'Kode voucher wajib diisi').max(20).trim().toUpperCase(),
	discountType: z.enum(['percent', 'nominal'], {
		errorMap: () => ({ message: 'Pilih jenis diskon yang valid' })
	}),
	discountValue: z.number().int().positive('Nilai diskon harus lebih dari 0'),
	minPurchase: z.number().int().min(0).default(0),
	validFrom: z.string().nullable().optional(),
	validUntil: z.string().nullable().optional(),
	applyToAll: z.boolean().default(true),
	productIds: z.array(z.number()).default([])
});

export type VoucherSchema = z.infer<typeof voucherSchema>;
