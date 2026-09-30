<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { stockEntrySchema } from '$lib/schemas/stock.schema.js';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';

	let { data, postUrl }: { data: any; postUrl: string } = $props();

	let searchTerm = $state('');
	let filteredProducts = $derived(
		data.products.filter(
			(p: any) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.code.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	let selectedProduct = $state<any>(null);

	const formObj = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(stockEntrySchema),
			async onSubmit({ cancel }) {
				const result = await validateForm();
				if (!result.valid) cancel();
			},
			onUpdate: ({ form, result }) => {
				if (result.type === 'success') {
					toast.success('Stok berhasil ditambahkan');
					selectedProduct = null;
				} else if (result.type === 'failure') {
					toast.error(form.message || 'Validasi gagal. Periksa kembali data yang Anda masukkan.');
				}
			}
		}
	);
	const { form: formData, enhance, validateForm } = formObj;

	const today = new Date().toISOString().split('T')[0];

	function openModal(product: any) {
		selectedProduct = product;
		$formData.productId = product.id;
		$formData.quantityIn = 1;
		$formData.entryDate = today;
	}

	function closeModal() {
		selectedProduct = null;
	}
</script>

<div class="mb-6">
	<h1 class="text-3xl font-bold tracking-tight">Stok Barang Masuk</h1>
	<p class="text-gray-500">Cari produk dan tambahkan stok baru ke gudang.</p>
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
				<Table.Head>Brand/Merk</Table.Head>
				<Table.Head class="text-right">Total Stok (Tersedia)</Table.Head>
				<Table.Head class="text-right">Aksi</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each filteredProducts as product (product.id)}
				<Table.Row>
					<Table.Cell class="font-medium">{product.code}</Table.Cell>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell>{product.brand || '-'}</Table.Cell>
					<Table.Cell class="text-right">
						<span
							class="inline-flex h-6 min-w-8 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-bold text-blue-700"
						>
							{product.total_stock}
						</span>
					</Table.Cell>
					<Table.Cell class="text-right">
						<Button variant="outline" size="sm" onclick={() => openModal(product)}>
							Tambah Stok
						</Button>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={5} class="h-24 text-center text-gray-500"
						>Produk tidak ditemukan.</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

{#if selectedProduct}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-bold">Catat Barang Masuk</h2>
				<button class="text-gray-500 hover:text-gray-700" onclick={closeModal}>✕</button>
			</div>

			<div class="mb-6 rounded-md bg-gray-50 p-3 text-sm">
				<div class="font-medium">{selectedProduct.name}</div>
				<div class="text-gray-500">{selectedProduct.code}</div>
			</div>

			<form method="POST" action="{postUrl}?/create" use:enhance class="space-y-4">
				<input type="hidden" name="productId" bind:value={$formData.productId} />

				<Form.Field form={formObj} name="quantityIn">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Jumlah Masuk (Qty)</Form.Label>
							<Input type="number" min="1" {...props} bind:value={$formData.quantityIn} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={formObj} name="entryDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Tanggal Masuk</Form.Label>
							<Input type="date" {...props} bind:value={$formData.entryDate} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="flex justify-end gap-2 pt-4">
					<Button type="button" variant="outline" onclick={closeModal}>Batal</Button>
					<Button type="submit">Simpan Stok</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
