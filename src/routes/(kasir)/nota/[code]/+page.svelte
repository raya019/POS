<script lang="ts">
	import { onMount } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	let { data } = $props();

	const formatRupiah = (val: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

	const formatDate = (date: Date | null) => {
		if (!date) return '-';
		return new Date(date).toLocaleString('id-ID', {
			year: 'numeric', month: 'short', day: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	onMount(() => {
		window.print();
	});
</script>

<div class="mb-6 print:hidden flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
	<div class="font-bold text-lg">Pratinjau Nota ({data.transactionCode})</div>
	<div class="space-x-2">
		<a href="/" class={buttonVariants({ variant: 'outline' })}>Ke Kasir Baru</a>
		<a href="/transaksi/riwayat" class={buttonVariants({ variant: 'outline' })}>Riwayat Transaksi</a>
		<button class={buttonVariants()} onclick={() => window.print()}>Cetak Ulang Nota</button>
	</div>
</div>

<!-- Area Struk Kasir -->
<div class="receipt bg-white p-4 border mx-auto text-sm text-gray-900" style="width: 80mm; font-family: monospace;">
	<div class="text-center mb-4">
		<div class="font-bold text-xl uppercase tracking-wider">GHANIMAH POS</div>
		<div class="text-xs mt-1">Belanja Mudah & Berkah</div>
		<div class="border-b border-dashed border-gray-400 mt-2 mb-2 pb-1"></div>
	</div>
	
	<div class="mb-4 text-xs leading-relaxed">
		<div><span class="inline-block w-12 font-bold">TRX</span>: {data.transactionCode}</div>
		<div><span class="inline-block w-12 font-bold">Waktu</span>: {formatDate(data.transactionDate)}</div>
		<div><span class="inline-block w-12 font-bold">Kasir</span>: {data.cashierName}</div>
	</div>

	<div class="border-b border-dashed border-gray-400 mb-2"></div>
	
	<table class="w-full mb-3 text-xs">
		<tbody>
			{#each data.items as item}
				<tr>
					<td colspan="3" class="pb-1 font-bold">{item.productName}</td>
				</tr>
				<tr>
					<td class="w-1/4 align-top">{item.qty} x</td>
					<td class="w-1/2 align-top text-right pr-2">{formatRupiah(item.unitPrice)}</td>
					<td class="w-1/4 align-top text-right">{formatRupiah(item.qty * item.unitPrice)}</td>
				</tr>
				{#if item.discount && item.discount > 0}
				<tr>
					<td colspan="2" class="text-right pr-2 italic">Diskon</td>
					<td class="text-right italic">-{formatRupiah(item.discount)}</td>
				</tr>
				{/if}
			{/each}
		</tbody>
	</table>

	<div class="border-b border-dashed border-gray-400 mb-2"></div>
	
	<div class="flex justify-between mb-1 text-xs">
		<span>Subtotal</span>
		<span>{formatRupiah(data.totalSubtotal)}</span>
	</div>
	{#if data.totalDiscount > 0}
	<div class="flex justify-between mb-1 text-xs">
		<span>Diskon {data.voucherUsed ? `(${data.voucherUsed})` : ''}</span>
		<span>-{formatRupiah(data.totalDiscount)}</span>
	</div>
	{/if}
	<div class="flex justify-between font-bold text-base mt-2 pt-2 border-t border-dashed border-gray-400">
		<span>TOTAL</span>
		<span>{formatRupiah(data.grandTotal)}</span>
	</div>

	<div class="text-center mt-8 text-xs">
		<div>*** TERIMA KASIH ***</div>
		<div>Silakan berkunjung kembali</div>
	</div>
</div>

<style>
	@media print {
		:global(body) * { visibility: hidden; }
		:global(.print\:hidden) { display: none !important; }
		.receipt, .receipt * { visibility: visible; }
		.receipt {
			position: absolute;
			top: 0;
			left: 0;
			width: 80mm;
			border: none;
			padding: 0;
			margin: 0;
		}
	}
</style>
