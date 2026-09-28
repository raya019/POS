<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { productSchema } from '$lib/schemas/product.schema.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';

	let { data } = $props();

	const form = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(productSchema),
			async onSubmit({ cancel }) {
				const result = await validateForm();
				if (!result.valid) cancel();
			},
			onUpdate: ({ form, result }) => {
				if (result.type === 'success') {
					toast.success('Login berhasil');
				} else {
					toast.error(form.message);
				}
			}
		}
	);
	const { form: formData, enhance, validateForm } = form;
</script>

<div class="mb-6 flex items-center gap-4">
	<a
		href="/admin/produk"
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		title="Kembali"
	>
		<ArrowLeft class="h-5 w-5" />
	</a>
	<h1 class="text-3xl font-bold tracking-tight">Tambah Produk</h1>
</div>

<div class="max-w-4xl rounded-md border bg-white p-6 shadow-sm">
	<form method="POST" use:enhance class="space-y-6">
		<Form.Field {form} name="code">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Kode Produk</Form.Label>
					<Input {...props} bind:value={$formData.code} placeholder="Misal: BRG001" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Nama Produk</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="barcode">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Barcode (Opsional)</Form.Label>
					<Input {...props} bind:value={$formData.barcode} placeholder="Scan barcode di sini..." />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="grid grid-cols-2 gap-4">
			<Form.Field {form} name="brand">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Merek (Opsional)</Form.Label>
						<Input {...props} bind:value={$formData.brand} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="size">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Ukuran (Opsional)</Form.Label>
						<select
							{...props}
							bind:value={$formData.size}
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="">-- Pilih Ukuran --</option>
							<option value="xs">XS</option>
							<option value="s">S</option>
							<option value="m">M</option>
							<option value="l">L</option>
							<option value="xl">XL</option>
							<option value="xxl">XXL</option>
							<option value="xxxl">XXXL</option>
						</select>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<Form.Field {form} name="buyPrice">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Harga Beli</Form.Label>
						<Input {...props} type="number" bind:value={$formData.buyPrice} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="sellPrice">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Harga Jual</Form.Label>
						<Input {...props} type="number" bind:value={$formData.sellPrice} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="mt-6 flex justify-end border-t pt-4">
			<Form.Button class="w-full px-8 md:w-auto">Simpan Produk</Form.Button>
		</div>
	</form>
</div>
