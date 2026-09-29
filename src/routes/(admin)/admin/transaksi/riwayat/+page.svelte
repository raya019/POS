<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	let { data } = $props();

	const formatRupiah = (val: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
		
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('id-ID', {
			year: 'numeric', month: 'short', day: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}
</script>

<div class="mb-6">
	<h1 class="text-3xl font-bold tracking-tight">Riwayat Transaksi Kasir</h1>
	<p class="text-gray-500">Daftar seluruh struk transaksi yang berhasil diproses.</p>
</div>

<!-- Form Filter Rentang Waktu -->
<form method="GET" class="mb-6 flex items-end gap-4 bg-white p-4 rounded-md shadow-sm border max-w-2xl">
	<div class="space-y-1.5 w-full">
		<label class="text-sm font-medium">Dari Tanggal</label>
		<input type="date" name="from" value={data.from} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
	</div>
	<div class="space-y-1.5 w-full">
		<label class="text-sm font-medium">Sampai Tanggal</label>
		<input type="date" name="to" value={data.to} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
	</div>
	<button type="submit" class={buttonVariants({ variant: 'default' })}>Filter</button>
</form>

<div class="rounded-md border bg-white shadow-sm">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Waktu</Table.Head>
				<Table.Head>Kode Transaksi</Table.Head>
				<Table.Head>Kasir</Table.Head>
				<Table.Head class="text-right">Total Item</Table.Head>
				<Table.Head class="text-right">Total Bayar</Table.Head>
				<Table.Head class="text-right">Aksi</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.history as trx}
				<Table.Row>
					<Table.Cell>{formatDate(trx.sold_at)}</Table.Cell>
					<Table.Cell class="font-medium">{trx.transaction_code}</Table.Cell>
					<Table.Cell>{trx.cashier_name}</Table.Cell>
					<Table.Cell class="text-right">{trx.total_items}</Table.Cell>
					<Table.Cell class="text-right font-bold text-blue-700">{formatRupiah(trx.total_amount)}</Table.Cell>
					<Table.Cell class="text-right">
						<a href="/admin/nota/{trx.transaction_code}" class={buttonVariants({ variant: 'outline', size: 'sm' })}>Buka Nota</a>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={6} class="h-24 text-center text-gray-500">Belum ada riwayat transaksi.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
