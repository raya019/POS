<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { data, form } = $props();

	interface CartItem {
		product: typeof data.products[0];
		qty: number;
	}

	let searchValue = $state('');
	let cart = $state<CartItem[]>([]);
	let voucherCode = $state('');

	const formatRupiah = (val: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key !== "Enter") return;
		e.preventDefault();

		// Cari exact match barcode (kasus scanner)
		const match = data.products.find((p) => p.barcode === searchValue);
		if (match) {
			addToCart(match);
			searchValue = '';
		}
	}

	function addToCart(product: typeof data.products[0]) {
		const existing = cart.find(c => c.product.id === product.id);
		if (existing) {
			if (existing.qty < product.total_stock) {
				existing.qty += 1;
			} else {
				alert(`Stok tidak cukup! (Maks: ${product.total_stock})`);
			}
		} else {
			cart.push({ product, qty: 1 });
		}
	}

	function updateQty(index: number, newQty: number) {
		if (newQty < 1) {
			cart.splice(index, 1);
		} else if (newQty > cart[index].product.total_stock) {
			alert(`Stok tidak cukup! (Maks: ${cart[index].product.total_stock})`);
		} else {
			cart[index].qty = newQty;
		}
	}

	// Filter untuk pencarian manual jika bukan barcode scanner
	let filteredProducts = $derived(
		searchValue.trim() === '' 
			? data.products 
			: data.products.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()) || p.code.toLowerCase().includes(searchValue.toLowerCase()))
	);

	let totalAmount = $derived(cart.reduce((sum, item) => sum + (item.product.sell_price * item.qty), 0));
	let cartDataJSON = $derived(JSON.stringify(cart.map(c => ({
		productId: c.product.id,
		qty: c.qty,
		unitPrice: c.product.sell_price
	}))));
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
	<!-- Bagian Kiri: Produk & Pencarian -->
	<div class="md:col-span-2 flex flex-col gap-4">
		<div class="flex gap-2 items-center">
			<Input 
				type="text" 
				placeholder="Cari nama produk, atau scan barcode (lalu Enter)..." 
				bind:value={searchValue} 
				onkeydown={handleKeydown} 
				autofocus 
				class="w-full text-lg p-6 font-medium"
			/>
		</div>
		
		<div class="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto pb-4">
			{#each filteredProducts as product}
				<button class="text-left focus:outline-none" onclick={() => addToCart(product)}>
					<Card.Root class="hover:border-blue-500 cursor-pointer transition-colors h-full">
						<Card.Header class="pb-2">
							<Card.Title class="text-lg leading-tight">{product.name}</Card.Title>
							<Card.Description>{product.code}</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="font-bold text-blue-700">{formatRupiah(product.sell_price)}</div>
							<div class="text-sm text-gray-500 mt-1">Stok Tersedia: {product.total_stock}</div>
						</Card.Content>
					</Card.Root>
				</button>
			{:else}
				<div class="col-span-3 text-center text-gray-500 py-10">Produk tidak ditemukan atau stok kosong.</div>
			{/each}
		</div>
	</div>

	<!-- Bagian Kanan: Keranjang -->
	<div class="bg-white rounded-md border shadow-sm flex flex-col h-full overflow-hidden">
		<div class="p-4 border-b font-bold text-lg bg-gray-50 text-gray-700">Keranjang Belanja</div>
		
		<div class="flex-1 overflow-auto p-4 space-y-4">
			{#if cart.length === 0}
				<div class="text-center text-gray-400 py-10 text-sm">Keranjang masih kosong</div>
			{/if}

			{#each cart as item, i}
				<div class="flex justify-between items-start border-b pb-4">
					<div class="flex-1 pr-2">
						<div class="font-bold text-sm">{item.product.name}</div>
						<div class="text-xs text-gray-500 mt-1">{formatRupiah(item.product.sell_price)}</div>
					</div>
					<div class="flex items-center gap-2">
						<Button variant="outline" size="sm" class="h-7 w-7 p-0" onclick={() => updateQty(i, item.qty - 1)}>-</Button>
						<div class="w-6 text-center font-bold text-sm">{item.qty}</div>
						<Button variant="outline" size="sm" class="h-7 w-7 p-0" onclick={() => updateQty(i, item.qty + 1)}>+</Button>
					</div>
				</div>
			{/each}
		</div>

		<div class="p-4 border-t bg-gray-50">
			{#if form?.error}
				<div class="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md font-medium text-center">
					{form.error}
				</div>
			{/if}

			<form method="POST" action="?/checkout" use:enhance class="space-y-4">
				<input type="hidden" name="cartData" value={cartDataJSON} />
				
				<div class="space-y-1.5">
					<Label for="voucher" class="text-xs text-gray-600">Kode Voucher (Opsional)</Label>
					<Input id="voucher" name="voucherCode" bind:value={voucherCode} placeholder="Misal: DISKON10" class="uppercase" />
				</div>

				<div class="flex justify-between items-end pt-2 pb-2">
					<div class="text-sm font-medium text-gray-500">Subtotal</div>
					<div class="text-2xl font-bold text-blue-700">{formatRupiah(totalAmount)}</div>
				</div>

				<Button type="submit" class="w-full h-12 text-lg font-bold shadow-sm" disabled={cart.length === 0}>
					Checkout & Bayar
				</Button>
			</form>
		</div>
	</div>
</div>
