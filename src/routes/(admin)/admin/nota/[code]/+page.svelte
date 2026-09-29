<script lang="ts">
	import { onMount } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	let { data } = $props();

	const formatRupiah = (val: number) =>
		new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(val);

	const formatDate = (date: Date | null) => {
		if (!date) return '-';
		return new Date(date).toLocaleString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	onMount(() => {
		window.print();
	});
</script>

<div class="mb-6 flex items-center justify-between rounded-md bg-white p-4 shadow-sm print:hidden">
	<div class="text-lg font-bold">Pratinjau Nota ({data.transactionCode})</div>
	<div class="flex items-center space-x-2">
		<a href="/admin/transaksi/riwayat" class={buttonVariants({ variant: 'outline' })}>
			<ArrowLeft class="mr-2 h-4 w-4" /> Kembali
		</a>
		<button class={buttonVariants()} onclick={() => window.print()}>Cetak Ulang Nota</button>
	</div>
</div>

<!-- Area Struk Kasir -->
<div
	class="receipt mx-auto border bg-white p-4 text-sm text-gray-900"
	style="width: 80mm; font-family: monospace;"
>
	<div class="mb-4 text-center">
		<div class="text-xl font-bold tracking-wider uppercase">GHANIMAH POS</div>
		<div class="mt-1 text-xs">Belanja Mudah & Berkah</div>
		<div class="mt-2 mb-2 border-b border-dashed border-gray-400 pb-1"></div>
	</div>

	<div class="mb-4 text-xs leading-relaxed">
		<div><span class="inline-block w-12 font-bold">TRX</span>: {data.transactionCode}</div>
		<div>
			<span class="inline-block w-12 font-bold">Waktu</span>: {formatDate(data.transactionDate)}
		</div>
		<div><span class="inline-block w-12 font-bold">Kasir</span>: {data.cashierName}</div>
	</div>

	<div class="mb-2 border-b border-dashed border-gray-400"></div>

	<table class="mb-3 w-full text-xs">
		<tbody>
			{#each data.items as item (item.id)}
				<tr>
					<td colspan="3" class="pb-1 font-bold">{item.productName}</td>
				</tr>
				<tr>
					<td class="w-1/4 align-top">{item.qty} x</td>
					<td class="w-1/2 pr-2 text-right align-top">{formatRupiah(item.unitPrice)}</td>
					<td class="w-1/4 text-right align-top">{formatRupiah(item.qty * item.unitPrice)}</td>
				</tr>
				{#if item.discount && item.discount > 0}
					<tr>
						<td colspan="2" class="pr-2 text-right italic">Diskon</td>
						<td class="text-right italic">-{formatRupiah(item.discount)}</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>

	<div class="mb-2 border-b border-dashed border-gray-400"></div>

	<div class="mb-1 flex justify-between text-xs">
		<span>Subtotal</span>
		<span>{formatRupiah(data.totalSubtotal)}</span>
	</div>
	{#if data.totalDiscount > 0}
		<div class="mb-1 flex justify-between text-xs">
			<span>Diskon {data.voucherUsed ? `(${data.voucherUsed})` : ''}</span>
			<span>-{formatRupiah(data.totalDiscount)}</span>
		</div>
	{/if}
	<div
		class="mt-2 flex justify-between border-t border-dashed border-gray-400 pt-2 text-base font-bold"
	>
		<span>TOTAL</span>
		<span>{formatRupiah(data.grandTotal)}</span>
	</div>

	<div class="mt-8 text-center text-xs">
		<div>*** TERIMA KASIH ***</div>
		<div>Silakan berkunjung kembali</div>
	</div>
</div>

<style>
	@media print {
		:global(body) * {
			visibility: hidden;
		}
		:global(.print\:hidden) {
			display: none !important;
		}
		.receipt,
		.receipt * {
			visibility: visible;
		}
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
