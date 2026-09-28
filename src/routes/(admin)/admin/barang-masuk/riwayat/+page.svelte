<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	let { data } = $props();

	// Format tanggal singkat ke dalam Indonesia locale
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	const today = new Date().toISOString().split('T')[0];
	let dariTanggal = $state(today);
	let keTanggal = $state(today);

	// Filter berdasarkan rentang tanggal
	let filteredHistory = $derived(
		data.history.filter((item: any) => {
			const entry = item.entryDate.split('T')[0];
			return entry >= dariTanggal && entry <= keTanggal;
		})
	);
</script>

<div class="mb-6">
	<h1 class="text-3xl font-bold tracking-tight">Riwayat Barang Masuk</h1>
</div>

<div class="mb-4 flex items-end gap-4 p-4 bg-white rounded-md border shadow-sm max-w-lg">
	<div class="space-y-1.5 w-full">
		<label class="text-sm font-medium">Dari Tanggal</label>
		<Input type="date" bind:value={dariTanggal} max={today} />
	</div>
	<div class="space-y-1.5 w-full">
		<label class="text-sm font-medium">Ke Tanggal</label>
		<Input type="date" bind:value={keTanggal} max={today} />
	</div>
</div>

<div class="rounded-md border bg-white">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Tanggal</Table.Head>
				<Table.Head>Kode</Table.Head>
				<Table.Head>Nama Produk</Table.Head>
				<Table.Head class="text-right">Awal Masuk</Table.Head>
				<Table.Head class="text-right">Sisa Stok</Table.Head>
				<Table.Head>Dicatat Oleh</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each filteredHistory as item (item.id)}
				<Table.Row>
					<Table.Cell>{formatDate(item.entryDate)}</Table.Cell>
					<Table.Cell class="font-medium">{item.productCode}</Table.Cell>
					<Table.Cell>{item.productName}</Table.Cell>
					<Table.Cell class="text-right font-semibold">{item.quantityIn}</Table.Cell>
					<Table.Cell class="text-right">
						<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 {item.quantityRemaining === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
							{item.quantityRemaining}
						</span>
					</Table.Cell>
					<Table.Cell>{item.creatorName}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={6} class="h-24 text-center">Belum ada riwayat barang masuk.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
