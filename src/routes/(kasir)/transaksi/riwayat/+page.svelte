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
						<a href="/nota/{trx.transaction_code}" class={buttonVariants({ variant: 'outline', size: 'sm' })}>Buka Nota</a>
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
