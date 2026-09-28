<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { stockEntrySchema } from '$lib/schemas/stock.schema';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	
	let { data } = $props();
	
	let searchTerm = $state('');
	let filteredProducts = $derived(
		data.products.filter((p: any) => 
			p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
			p.code.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	let selectedProduct = $state<any>(null);
	
	const form = superForm(untrack(() => data.form), {
		validators: zod4Client(stockEntrySchema),
		onUpdated({ form }) {
			if (form.message) {
				if (form.valid) {
					toast.success(form.message);
					selectedProduct = null; // Tutup modal setelah sukses
				} else {
					toast.error(form.message);
				}
			} else if (!form.valid && Object.keys(form.errors).length > 0) {
				toast.error('Validasi gagal. Periksa kembali data yang Anda masukkan.');
			}
		},
		onError(event) {
			toast.error('Terjadi kesalahan saat menghubungi server.');
		}
	});
	const { form: formData, enhance, message } = form;

	// Set default date ke hari ini
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
	<Input bind:value={searchTerm} placeholder="Cari nama atau kode produk..." class="max-w-sm bg-white" />
</div>

<div class="rounded-md border bg-white">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Kode</Table.Head>
				<Table.Head>Nama Produk</Table.Head>
				<Table.Head>Ukuran</Table.Head>
				<Table.Head class="text-right">Aksi</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each filteredProducts as product (product.id)}
				<Table.Row>
					<Table.Cell class="font-medium">{product.code}</Table.Cell>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell>{product.size || '-'}</Table.Cell>
					<Table.Cell class="text-right">
						<Button size="sm" onclick={() => openModal(product)}>Tambah Stok</Button>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={4} class="h-24 text-center">Produk tidak ditemukan.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

{#if selectedProduct}
<!-- Modal Overlay -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
	<div class="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
		<h2 class="text-xl font-bold mb-4">Tambah Stok</h2>
		<div class="mb-4 text-sm bg-blue-50 p-3 rounded-md text-blue-800">
			<strong>Produk:</strong> {selectedProduct.name} <br/>
			<strong>Kode:</strong> {selectedProduct.code}
		</div>

		<form method="POST" use:enhance class="space-y-4">
			<input type="hidden" name="productId" bind:value={$formData.productId} />
			<input type="hidden" name="entryDate" bind:value={$formData.entryDate} />
			
			<Form.Field {form} name="quantityIn">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Jumlah Masuk (Qty)</Form.Label>
						<Input {...props} type="number" bind:value={$formData.quantityIn} min="1" autofocus />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex justify-end gap-2 pt-4 border-t mt-4">
				<Button type="button" variant="outline" onclick={closeModal}>Batal</Button>
				<Button type="submit">Simpan Stok</Button>
			</div>
		</form>
	</div>
</div>
{/if}

