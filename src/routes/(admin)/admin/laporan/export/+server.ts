import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { reportFilterSchema } from '$lib/schemas/report-filter.schema';
import { getSalesReport } from '$lib/server/report';
import { buildReportDocument, buildPdfBuffer } from '$lib/server/pdf/report-pdf';

export const GET: RequestHandler = async ({ url, locals }) => {
	// Pengecekan role secara manual di endpoint server ini
	if (locals.user?.role !== 'admin_owner') {
		error(403, 'Akses ditolak. Anda tidak memiliki izin untuk mengunduh laporan.');
	}

	const parsed = reportFilterSchema.safeParse({
		from: url.searchParams.get('from'),
		to: url.searchParams.get('to')
	});

	if (!parsed.success) {
		error(400, 'Parameter periode laporan tidak valid.');
	}

	const { from, to } = parsed.data;

	// 1. Ambil data transaksi dari database
	const rows = await getSalesReport(from, to);

	// 2. Bentuk layout dokumen PDF
	const docDefinition = buildReportDocument(rows, { from, to });

	// 3. Konversi menjadi Buffer PDF
	const pdfBuffer = await buildPdfBuffer(docDefinition);

	// 4. Kembalikan Response download
	return new Response(pdfBuffer, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="laporan-penjualan-${from}_${to}.pdf"`
		}
	});
};
