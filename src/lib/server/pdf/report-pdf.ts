import pdfmake from 'pdfmake';
import type { ReportRow } from '../report';

// Matikan peringatan akses URL/lokal karena kita tidak memakai image external di pdf ini
pdfmake.setUrlAccessPolicy(() => true);
pdfmake.setLocalAccessPolicy(() => true);

pdfmake.setFonts({
	Roboto: {
		normal: 'src/lib/server/pdf/fonts/Roboto-Regular.ttf',
		bold: 'src/lib/server/pdf/fonts/Roboto-Bold.ttf',
		italics: 'src/lib/server/pdf/fonts/Roboto-Italic.ttf',
		bolditalics: 'src/lib/server/pdf/fonts/Roboto-BoldItalic.ttf'
	}
});

const formatRupiah = (val: number) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(val);

export function buildReportDocument(rows: ReportRow[], period: { from: string; to: string }) {
	const totalPendapatan = rows.reduce((sum, r) => sum + r.total, 0);

	return {
		defaultStyle: { font: 'Roboto', fontSize: 9 },
		content: [
			{ text: 'Laporan Penjualan — Ghanimah Collection', fontSize: 14, bold: true },
			{ text: `Periode ${period.from} s.d. ${period.to}`, margin: [0, 2, 0, 10] },
			{
				table: {
					headerRows: 1, // header diulang otomatis di setiap halaman
					widths: ['auto', '*', '*', 'auto', 'auto', 'auto', 'auto'],
					body: [
						[
							{ text: 'Tanggal', bold: true },
							{ text: 'Kode transaksi', bold: true },
							{ text: 'Produk', bold: true },
							{ text: 'Qty', bold: true, alignment: 'right' },
							{ text: 'Harga', bold: true, alignment: 'right' },
							{ text: 'Diskon', bold: true, alignment: 'right' },
							{ text: 'Total', bold: true, alignment: 'right' }
						],
						...rows.map((r) => [
							r.date,
							r.transactionCode,
							r.productName,
							{ text: r.qty.toString(), alignment: 'right' },
							{ text: formatRupiah(r.unitPrice), alignment: 'right' },
							{ text: formatRupiah(r.discount), alignment: 'right' },
							{ text: formatRupiah(r.total), alignment: 'right' }
						])
					]
				}
			},
			{
				text: `Total penjualan: ${formatRupiah(totalPendapatan)}`,
				bold: true,
				alignment: 'right',
				margin: [0, 10, 0, 0]
			}
		],
		footer: (currentPage: number, pageCount: number) => ({
			text: `Halaman ${currentPage} dari ${pageCount}`,
			alignment: 'center',
			fontSize: 8,
			margin: [0, 10, 0, 0]
		})
	};
}

export async function buildPdfBuffer(docDefinition: any): Promise<Buffer> {
	const doc = pdfmake.createPdf(docDefinition);
	const buffer = await doc.getBuffer();
	return Buffer.from(buffer); // Convert Uint8Array to Node Buffer
}
