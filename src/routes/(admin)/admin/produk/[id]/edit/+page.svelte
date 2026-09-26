<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productSchema } from '$lib/schemas/product.schema';
	import { buttonVariants } from '$lib/components/ui/button';
	
	import { untrack } from 'svelte';
	
	let { data } = $props();
	
	const form = superForm(untrack(() => data.form), {
		validators: zodClient(productSchema)
	});
	const { form: formData, enhance, message } = form;
</script>

<div class="mb-6 flex items-center gap-4">
	<a href="/admin/produk" class={buttonVariants({ variant: 'outline' })}>Kembali</a>
	<h1 class="text-3xl font-bold tracking-tight">Edit Produk: {data.productName}</h1>
</div>

<div class="max-w-2xl bg-white p-6 rounded-md border shadow-sm">
	{#if $message}
		<div class="mb-4 p-3 bg-red-100 text-red-700 rounded">
			{$message}
		</div>
	{/if}
	
	<form method="POST" use:enhance class="space-y-4">
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
						<Input {...props} bind:value={$formData.size} placeholder="L, XL, 100g, dll" />
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

		<Form.Field {form} name="barcode">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Barcode (Opsional)</Form.Label>
					<Input {...props} bind:value={$formData.barcode} placeholder="Scan barcode di sini..." />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button class="w-full mt-6">Update Produk</Form.Button>
	</form>
</div>
