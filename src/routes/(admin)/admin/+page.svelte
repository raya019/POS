<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	let { data } = $props();

	// Format Rupiah helper
	const formatRupiah = (val: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold tracking-tight">Dashboard Admin</h1>

	<div class="grid gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-medium text-gray-500">Penjualan Hari Ini</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatRupiah(data.salesToday)}</div>
			</Card.Content>
		</Card.Root>
		
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-medium text-gray-500">Transaksi Bulan Ini</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{data.transactionsThisMonth}</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-medium text-gray-500">Voucher Aktif</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{data.activeVouchers}</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Tabel Stok Kritis -->
	<Card.Root class="border-red-100 shadow-sm">
		<Card.Header class="bg-red-50 border-b border-red-100">
			<Card.Title class="text-red-700 flex items-center gap-2">
				Stok Kritis (Total &lt; 5)
			</Card.Title>
			<Card.Description class="text-red-600">
				Produk berikut hampir habis atau sudah kosong dan memerlukan restock segera.
			</Card.Description>
		</Card.Header>
		<Card.Content class="p-0">
			{#if data.criticalStocks.length === 0}
				<div class="p-6 text-center text-gray-500">
					Semua stok produk aman.
				</div>
			{:else}
				<div class="relative w-full overflow-auto">
					<table class="w-full caption-bottom text-sm">
						<thead class="[&_tr]:border-b">
							<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
								<th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Kode</th>
								<th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Nama Produk</th>
								<th class="h-12 px-4 text-right align-middle font-medium text-gray-500">Sisa Stok</th>
							</tr>
						</thead>
						<tbody class="[&_tr:last-child]:border-0">
							{#each data.criticalStocks as stock}
								<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
									<td class="p-4 align-middle">{stock.code}</td>
									<td class="p-4 align-middle font-medium">{stock.name}</td>
									<td class="p-4 align-middle text-right">
										<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold {stock.total_qty === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}">
											{stock.total_qty}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
