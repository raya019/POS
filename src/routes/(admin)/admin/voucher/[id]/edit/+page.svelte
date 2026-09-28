<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from 'phosphor-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	
	import { untrack } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { voucherSchema } from '$lib/schemas/voucher.schema.js';

	let { data } = $props();
	
	let searchTerm = $state('');
	let filteredProducts = $derived(
		data.products.filter((p: any) => 
			p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
			p.code.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	// Tentukan tanggal minimal untuk validitas voucher (besok)
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const minDate = tomorrow.toISOString().split('T')[0];

	const form = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(voucherSchema),
			dataType: 'json'
		}
	);

	const { form: formData, enhance, message } = form;

	function toggleProduct(productId: number, checked: boolean) {
		if (checked) {
			$formData.productIds = [...$formData.productIds, productId];
		} else {
			$formData.productIds = $formData.productIds.filter(id => id !== productId);
		}
	}
</script>

<div class="mb-6 flex items-center gap-4">
	<a href="/admin/voucher" class={buttonVariants({ variant: 'outline', size: 'icon' })} title="Kembali">
		<ArrowLeft class="h-5 w-5" />
	</a>
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Edit Voucher</h1>
		<p class="text-gray-500">Ubah detail kode promo diskon.</p>
	</div>
</div>

<div class="max-w-4xl">
	<Card.Root>
		<Card.Header>
			<Card.Title>Form Edit Voucher</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if $message}
				<div class="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
					{$message}
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-6">
				<!-- Group fields into a grid to prevent them from stretching too wide -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-4">
						<Form.Field {form} name="code">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Kode Voucher</Form.Label>
									<Input {...props} bind:value={$formData.code} placeholder="Misal: DISKON10" class="uppercase" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<div class="grid grid-cols-2 gap-4">
							<Form.Field {form} name="discountType">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Jenis Diskon</Form.Label>
										<select
											{...props}
											bind:value={$formData.discountType}
											class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										>
											<option value="percent">Persentase (%)</option>
											<option value="nominal">Nominal (Rp)</option>
										</select>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="discountValue">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Nilai Diskon</Form.Label>
										<Input {...props} type="number" bind:value={$formData.discountValue} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>

						<Form.Field {form} name="minPurchase">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Minimal Pembelian (Rp)</Form.Label>
									<Input {...props} type="number" bind:value={$formData.minPurchase} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="space-y-4">
						<Form.Field {form} name="validFrom">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Berlaku Dari (Opsional)</Form.Label>
									<input type="date" {...props} min={minDate} bind:value={$formData.validFrom} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="validUntil">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Berlaku Sampai (Opsional)</Form.Label>
									<input type="date" {...props} min={$formData.validFrom || minDate} bind:value={$formData.validUntil} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						
						<Form.Field {form} name="applyToAll">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Cakupan Voucher</Form.Label>
									<select
										{...props}
										bind:value={$formData.applyToAll}
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									>
										<!-- Note: bind:value stringifies boolean, so we map true/false via JSON in string if possible, or bind explicitly via another variable -->
										<option value={true}>Berlaku untuk SEMUA produk</option>
										<option value={false}>Berlaku untuk PRODUK TERTENTU</option>
									</select>
								{/snippet}
							</Form.Control>
						</Form.Field>
					</div>
				</div>

				<!-- Product Restriction List -->
				{#if $formData.applyToAll === false || $formData.applyToAll === 'false'}
					<div class="border-t pt-4 mt-6">
						<div class="bg-gray-50 p-4 border rounded-md max-h-80 overflow-y-auto">
							<Label class="mb-3 block font-bold">Pilih Produk Tertentu:</Label>
							{#if $formData.productIds.length === 0}
								<p class="text-sm text-red-600 mb-4 font-medium">⚠️ Harap pilih minimal 1 produk dari daftar di bawah.</p>
							{/if}
							
							<div class="mb-4 mt-2">
								<Input bind:value={searchTerm} placeholder="Cari nama atau kode produk..." class="bg-white" />
							</div>
							
							<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
								{#each filteredProducts as product}
									<label class="flex items-start space-x-3 p-3 hover:bg-gray-100 rounded border bg-white cursor-pointer transition-colors">
										<input 
											type="checkbox" 
											class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
											checked={$formData.productIds.includes(product.id)}
											onchange={(e) => toggleProduct(product.id, e.currentTarget.checked)}
										/>
										<div class="grid gap-1 leading-none">
											<span class="font-medium text-sm">{product.name}</span>
											<span class="text-xs text-gray-500">{product.code}</span>
										</div>
									</label>
								{:else}
									<p class="text-sm text-gray-500 italic">Tidak ada produk yang cocok dengan pencarian.</p>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<div class="flex justify-end gap-2 pt-6 border-t mt-6">
					<Button type="button" variant="outline" href="/admin/voucher">Batal</Button>
					<Button type="submit">Update Voucher</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>

