<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { StatCard, formatRupiah } from '$lib';

	let { data } = $props();
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold tracking-tight">Dashboard Admin</h1>

	<div class="grid gap-4 md:grid-cols-3">
		<StatCard title="Penjualan Hari Ini" value={formatRupiah(data.salesToday)} />
		<StatCard title="Transaksi Bulan Ini" value={data.transactionsThisMonth} />
		<StatCard title="Voucher Aktif" value={data.activeVouchers} />
	</div>

	<!-- Tabel Stok Kritis -->
	<Card.Root class="border-red-100 shadow-sm">
		<Card.Header class="border-b border-red-100 ">
			<Card.Title class="flex items-center gap-2 text-red-700">
				Stok Kritis (Total &lt; 5)
			</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			{#if data.criticalStocks.length === 0}
				<div class="p-6 text-center text-gray-500">Semua stok produk aman.</div>
			{:else}
				<div class="relative w-full overflow-auto">
					<table class="w-full caption-bottom text-sm">
						<thead class="[&_tr]:border-b">
							<tr
								class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
							>
								<th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Kode</th>
								<th class="h-12 px-4 text-left align-middle font-medium text-gray-500"
									>Nama Produk</th
								>
								<th class="h-12 px-4 text-right align-middle font-medium text-gray-500"
									>Sisa Stok</th
								>
							</tr>
						</thead>
						<tbody class="[&_tr:last-child]:border-0">
							{#each data.criticalStocks as stock (stock.code)}
								<tr
									class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
								>
									<td class="p-4 align-middle">{stock.code}</td>
									<td class="p-4 align-middle font-medium">{stock.name}</td>
									<td class="p-4 text-right align-middle">
										<span
											class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold {stock.total_qty ===
											0
												? 'bg-red-100 text-red-800'
												: 'bg-orange-100 text-orange-800'}"
										>
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
