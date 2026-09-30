<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatRupiah } from '$lib';

	let { data } = $props();
	
	let searchTerm = $state('');

	let filteredProducts = $derived(
		data.products.filter(
			(p) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.code.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);
</script>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-3xl font-bold tracking-tight">Data Produk</h1>
	<a href="/admin/produk/tambah" class={buttonVariants()}>Tambah Produk</a>
</div>

<div class="mb-4">
	<Input
		bind:value={searchTerm}
		placeholder="Cari nama atau kode produk..."
		class="max-w-sm bg-white"
	/>
</div>

<div class="rounded-md border bg-white">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Kode</Table.Head>
				<Table.Head>Nama Produk</Table.Head>
				<Table.Head>Brand</Table.Head>
				<Table.Head>Ukuran</Table.Head>
				<Table.Head>Harga Beli</Table.Head>
				<Table.Head>Harga Jual</Table.Head>
				<Table.Head class="text-right">Aksi</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each filteredProducts as product (product.id)}
				<Table.Row>
					<Table.Cell class="font-medium">{product.code}</Table.Cell>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell>{product.brand || '-'}</Table.Cell>
					<Table.Cell>{product.size || '-'}</Table.Cell>
					<Table.Cell>{formatRupiah(product.buyPrice)}</Table.Cell>
					<Table.Cell>{formatRupiah(product.sellPrice)}</Table.Cell>
					<Table.Cell class="text-right">
						<a
							href="/admin/produk/{product.id}/edit"
							class={buttonVariants({ variant: 'outline', size: 'sm' })}>Edit</a
						>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={7} class="h-24 text-center">Belum ada data produk.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
