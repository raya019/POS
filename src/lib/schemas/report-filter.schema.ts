import { z } from 'zod';

export const reportFilterSchema = z.object({
	from: z.iso.date('Format tanggal dari tidak valid (Gunakan YYYY-MM-DD)'),
	to: z.iso.date('Format tanggal sampai tidak valid (Gunakan YYYY-MM-DD)')
});

export type ReportFilterSchema = z.infer<typeof reportFilterSchema>;
