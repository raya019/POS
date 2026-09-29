<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { data } = $props();

	const formatRupiah = (val: number) =>
		new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(val);
</script>

<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Laporan Penjualan</h1>
		<p class="text-gray-500">Ringkasan transaksi dan performa penjualan.</p>
	</div>

	<!-- Tombol Export PDF dengan data-sveltekit-reload agar murni mengunduh file, bukan navigasi halaman SPA -->
	<a
		href="/admin/laporan/export?from={data.from}&to={data.to}"
		data-sveltekit-reload
		download
		class={buttonVariants({ variant: 'default' })}
	>
		Ekspor PDF
	</a>
</div>

<!-- Form Filter Rentang Waktu -->
<form
	method="GET"
	class="mb-6 flex max-w-2xl items-end gap-4 rounded-md border bg-white p-4 shadow-sm"
>
	<div class="w-full space-y-1.5">
		<Label for="from" class="text-sm font-medium">Dari Tanggal</Label>
		<Input type="date" name="from" value={data.from} />
	</div>
	<div class="w-full space-y-1.5">
		<Label for="to" class="text-sm font-medium">Sampai Tanggal</Label>
		<Input type="date" name="to" value={data.to} />
	</div>
	<Button type="submit">Filter Laporan</Button>
</form>

<!-- Kartu Ringkasan Metrik -->
<div class="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium text-gray-600">Total Pendapatan</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{formatRupiah(data.summary.totalRevenue)}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium text-gray-600">Total Barang Terjual</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{data.summary.totalItems}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium text-gray-600">Total Transaksi</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{data.summary.totalTransactions}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium text-gray-600">Total Diskon (Voucher)</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold text-red-600">{formatRupiah(data.summary.totalDiscount)}</div>
		</Card.Content>
	</Card.Root>
</div>

<!-- Tabel Laporan Penjualan -->
<div class="rounded-md border bg-white">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Tanggal</Table.Head>
				<Table.Head>Kode TRX</Table.Head>
				<Table.Head>Produk</Table.Head>
				<Table.Head class="text-right">Qty</Table.Head>
				<Table.Head class="text-right">Harga</Table.Head>
				<Table.Head class="text-right">Diskon</Table.Head>
				<Table.Head class="text-right">Total</Table.Head>
				<Table.Head>Kasir</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.salesData as sale}
				<Table.Row>
					<Table.Cell>{sale.date}</Table.Cell>
					<Table.Cell class="font-medium">{sale.transactionCode}</Table.Cell>
					<Table.Cell>{sale.productName}</Table.Cell>
					<Table.Cell class="text-right">{sale.qty}</Table.Cell>
					<Table.Cell class="text-right">{formatRupiah(sale.unitPrice)}</Table.Cell>
					<Table.Cell class="text-right text-red-600">{formatRupiah(sale.discount)}</Table.Cell>
					<Table.Cell class="text-right font-semibold">{formatRupiah(sale.total)}</Table.Cell>
					<Table.Cell>{sale.cashierName}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={8} class="h-24 text-center"
						>Tidak ada transaksi pada periode ini.</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
