<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { toast } from 'svelte-sonner';
	import { formatRupiah } from '$lib';

	let { data, form } = $props();

	interface CartItem {
		product: (typeof data.products)[0];
		qty: number;
	}

	let searchValue = $state('');
	let cart = $state<CartItem[]>([]);
	let voucherCode = $state('');

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		e.preventDefault();

		// Cari exact match barcode (kasus scanner)
		const match = data.products.find((p) => p.barcode === searchValue);
		if (match) {
			addToCart(match);
			searchValue = '';
		}
	}

	function addToCart(product: (typeof data.products)[0]) {
		const existing = cart.find((c) => c.product.id === product.id);
		if (existing) {
			if (existing.qty < product.total_stock) {
				existing.qty += 1;
			} else {
				toast.error(`Stok tidak cukup! (Maks: ${product.total_stock})`);
			}
		} else {
			cart.push({ product, qty: 1 });
		}
	}

	function updateQty(index: number, newQty: number) {
		if (newQty < 1) {
			cart.splice(index, 1);
		} else if (newQty > cart[index].product.total_stock) {
			toast.error(`Stok tidak cukup! (Maks: ${cart[index].product.total_stock})`);
		} else {
			cart[index].qty = newQty;
		}
	}

	// Filter untuk pencarian manual jika bukan barcode scanner
	let filteredProducts = $derived(
		searchValue.trim() === ''
			? data.products
			: data.products.filter(
					(p) =>
						p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
						p.code.toLowerCase().includes(searchValue.toLowerCase())
				)
	);

	let subtotalAmount = $derived(
		cart.reduce((sum, item) => sum + item.product.sell_price * item.qty, 0)
	);

	let totalDiscount = $derived(() => {
		if (!voucherCode) return 0;
		const voucher = data.vouchers.find((v) => v.code === voucherCode);
		if (!voucher) return 0;

		if (voucher.minPurchase && subtotalAmount < voucher.minPurchase) return 0;

		const cartItems = cart.map((c) => ({
			productId: c.product.id,
			subtotal: c.product.sell_price * c.qty
		}));

		const eligibleItems =
			voucher.restrictedIds.length === 0
				? cartItems
				: cartItems.filter((i) => voucher.restrictedIds.includes(i.productId));

		const eligibleSubtotal = eligibleItems.reduce((acc, i) => acc + i.subtotal, 0);
		if (eligibleSubtotal === 0) return 0;

		if (voucher.discountType === 'percent') {
			return eligibleItems.reduce(
				(sum, item) => sum + Math.round((item.subtotal * voucher.discountValue) / 100),
				0
			);
		} else {
			return Math.min(eligibleSubtotal, voucher.discountValue);
		}
	});

	let grandTotal = $derived(subtotalAmount - totalDiscount());

	let cartDataJSON = $derived(
		JSON.stringify(
			cart.map((c) => ({
				productId: c.product.id,
				qty: c.qty,
				unitPrice: c.product.sell_price
			}))
		)
	);
</script>

<div class="grid h-[calc(100vh-100px)] grid-cols-1 gap-6 md:grid-cols-3">
	<!-- Bagian Kiri: Produk & Pencarian -->
	<div class="flex flex-col gap-4 md:col-span-2">
		<div class="flex items-center gap-2">
			<Input
				type="text"
				placeholder="Cari nama produk, atau scan barcode (lalu Enter)..."
				bind:value={searchValue}
				onkeydown={handleKeydown}
				autofocus
				class="w-full p-6 text-lg font-medium"
			/>
		</div>

		<div class="grid grid-cols-2 gap-4 overflow-auto pb-4 lg:grid-cols-3">
			{#each filteredProducts as product (product.id)}
				<button class="text-left focus:outline-none" onclick={() => addToCart(product)}>
					<Card.Root class="h-full cursor-pointer transition-colors hover:border-blue-500">
						<Card.Header class="pb-2">
							<Card.Title class="text-lg leading-tight">{product.name}</Card.Title>
							<Card.Description>{product.code}</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="font-bold text-blue-700">{formatRupiah(product.sell_price)}</div>
							<div class="mt-1 text-sm text-gray-500">Stok Tersedia: {product.total_stock}</div>
						</Card.Content>
					</Card.Root>
				</button>
			{:else}
				<div class="col-span-3 py-10 text-center text-gray-500">
					Produk tidak ditemukan atau stok kosong.
				</div>
			{/each}
		</div>
	</div>

	<!-- Bagian Kanan: Keranjang -->
	<div class="flex h-full flex-col overflow-hidden rounded-md border bg-white shadow-sm">
		<div class="border-b bg-gray-50 p-4 text-lg font-bold text-gray-700">Keranjang Belanja</div>

		<div class="flex-1 space-y-4 overflow-auto p-4">
			{#if cart.length === 0}
				<div class="py-10 text-center text-sm text-gray-400">Keranjang masih kosong</div>
			{/if}

			{#each cart as item, i (i)}
				<div class="flex items-start justify-between border-b pb-4">
					<div class="flex-1 pr-2">
						<div class="text-sm font-bold">{item.product.name}</div>
						<div class="mt-1 text-xs text-gray-500">{formatRupiah(item.product.sell_price)}</div>
					</div>
					<div class="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							class="h-7 w-7 p-0"
							onclick={() => updateQty(i, item.qty - 1)}>-</Button
						>
						<div class="w-6 text-center text-sm font-bold">{item.qty}</div>
						<Button
							variant="outline"
							size="sm"
							class="h-7 w-7 p-0"
							onclick={() => updateQty(i, item.qty + 1)}>+</Button
						>
					</div>
				</div>
			{/each}
		</div>

		<div class="border-t bg-gray-50 p-4">
			<div class="space-y-4">
				<div class="space-y-1.5">
					<Label for="voucher" class="text-xs text-gray-600">Pilih Voucher</Label>
					<select
						id="voucher"
						name="voucherCode"
						bind:value={voucherCode}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">-- Tanpa Voucher --</option>
						{#each data.vouchers as v (v.id)}
							<option value={v.code}
								>{v.code} - {v.discountType === 'percent'
									? v.discountValue + '%'
									: formatRupiah(v.discountValue)}</option
							>
						{/each}
					</select>
				</div>

				<div class="space-y-1 pt-2 pb-2">
					<div class="flex items-end justify-between">
						<div class="text-sm font-medium text-gray-500">Subtotal</div>
						<div class="text-base font-medium">{formatRupiah(subtotalAmount)}</div>
					</div>
					{#if totalDiscount() > 0}
						<div class="flex items-end justify-between text-red-600">
							<div class="text-sm font-medium">Diskon</div>
							<div class="text-base font-medium">-{formatRupiah(totalDiscount())}</div>
						</div>
					{/if}
					<div class="mt-2 flex items-end justify-between border-t pt-2">
						<div class="text-sm font-bold text-gray-700">Total</div>
						<div class="text-2xl font-bold text-blue-700">{formatRupiah(grandTotal)}</div>
					</div>
				</div>

				<Dialog.Root>
					<Dialog.Trigger disabled={cart.length === 0} class={buttonVariants({ size: 'lg' })}>
						Checkout & Bayar
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Apakah kamu Yakin?</Dialog.Title>
							<Dialog.Description>
								Ingin Melanjutkan Transaksi Sebesar <strong class="text-gray-900">
									{formatRupiah(grandTotal)}</strong
								>
							</Dialog.Description>
							<Dialog.Footer class="gap-x-3 pt-3">
								<form method="POST" action="?/checkout" use:enhance>
									<input type="hidden" name="cartData" value={cartDataJSON} />
									<input type="hidden" name="voucherCode" value={voucherCode} />
									<Button size="lg" type="submit">Lanjutkan</Button>
								</form>
								<Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Close</Dialog.Close>
							</Dialog.Footer>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</div>
</div>
