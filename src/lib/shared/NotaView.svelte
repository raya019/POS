<script lang="ts">
	import { onMount } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import { formatRupiah, formatDate } from '$lib';

	let {
		data,
		role = 'kasir'
	}: {
		data: any;
		role?: 'admin' | 'kasir';
	} = $props();

	onMount(() => {
		window.print();
	});
</script>

<div class="mb-6 flex items-center justify-between rounded-md bg-white p-4 shadow-sm print:hidden">
	<div class="text-lg font-bold">Pratinjau Nota ({data.transactionCode})</div>
	<div class="flex items-center space-x-2">
		{#if role === 'admin'}
			<a href="/admin/transaksi/riwayat" class={buttonVariants({ variant: 'outline' })}>
				<ArrowLeft class="mr-2 h-4 w-4" /> Kembali
			</a>
		{:else}
			<a href="/" class={buttonVariants({ variant: 'outline' })}>Ke Kasir Baru</a>
			<a href="/transaksi/riwayat" class={buttonVariants({ variant: 'outline' })}>Riwayat Transaksi</a>
		{/if}
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
	</div>

	<div class="mb-2 border-b border-dashed pb-2 text-xs">
		<div class="flex justify-between">
			<span>No:</span>
			<span>{data.transactionCode}</span>
		</div>
		<div class="flex justify-between">
			<span>Tgl:</span>
			<span>{formatDate(data.receiptData.sold_at)}</span>
		</div>
		<div class="flex justify-between">
			<span>Kasir:</span>
			<span>{data.receiptData.cashier_name}</span>
		</div>
	</div>

	<div class="mb-2 border-b border-dashed pb-2">
		<table class="w-full text-xs">
			<tbody>
				{#each data.items as item}
					<tr>
						<td class="py-1" colspan="3">
							<div class="font-bold">{item.product_name}</div>
						</td>
					</tr>
					<tr>
						<td class="py-1 text-gray-600">{item.quantity} x {formatRupiah(item.unit_price)}</td>
						<td class="py-1 text-right">{formatRupiah(item.quantity * item.unit_price)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="border-b border-dashed pb-2 text-sm">
		<div class="flex justify-between font-bold">
			<span>Total Bayar</span>
			<span>{formatRupiah(data.receiptData.total_paid)}</span>
		</div>
		{#if data.receiptData.discount_amount > 0}
			<div class="mt-1 flex justify-between text-xs text-red-600">
				<span>Diskon (Voucher)</span>
				<span>-{formatRupiah(data.receiptData.discount_amount)}</span>
			</div>
		{/if}
	</div>

	<div class="mt-4 text-center text-xs">
		<p>Terima kasih atas kunjungan Anda!</p>
		<p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
	</div>
</div>
