<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { formatRupiah, formatDate } from '$lib';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let {
		data,
		notaUrlPrefix
	}: {
		data: { history: any[]; from: string; to: string };
		notaUrlPrefix: string;
	} = $props();
</script>

<div class="mb-6">
	<h1 class="text-3xl font-bold tracking-tight">Riwayat Transaksi Kasir</h1>
	<p class="text-gray-500">Daftar seluruh struk transaksi yang berhasil diproses.</p>
</div>

<!-- Form Filter Rentang Waktu -->
<form
	method="GET"
	class="mb-6 flex max-w-2xl items-end gap-4 rounded-md border bg-white p-4 shadow-sm"
>
	<div class="w-full space-y-1.5">
		<Label class="text-sm font-medium">Dari Tanggal</Label>
		<Input type="date" name="from" value={data.from} />
	</div>
	<div class="w-full space-y-1.5">
		<Label class="text-sm font-medium">Sampai Tanggal</Label>
		<Input type="date" name="to" value={data.to} />
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
					<Table.Cell class="text-right font-bold text-blue-700"
						>{formatRupiah(trx.total_amount)}</Table.Cell
					>
					<Table.Cell class="text-right">
						<a
							href="{notaUrlPrefix}/{trx.transaction_code}"
							class={buttonVariants({ variant: 'outline', size: 'sm' })}>Buka Nota</a
						>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={6} class="h-24 text-center text-gray-500"
						>Belum ada riwayat transaksi.</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
