<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	let { role = 'kasir' }: { role?: 'admin_owner' | 'kasir' | string } = $props();
</script>

<aside class="flex w-64 flex-col border-r bg-white shadow-sm">
	<div class="border-b p-6 text-xl font-bold {role === 'kasir' ? 'text-blue-700' : ''}">
		Ghanimah POS
	</div>
	<nav class="flex-1 space-y-2 p-4">
		{#if role === 'admin_owner'}
			<a href="/admin" class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>Dashboard</a
			>
			<a
				href="/admin/produk"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100">Data Produk</a
			>
			<a
				href="/admin/barang-masuk"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>Stok Barang Masuk</a
			>
			<a
				href="/admin/barang-masuk/riwayat"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100">Riwayat Stok</a
			>
			<a
				href="/admin/transaksi/riwayat"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>Riwayat Transaksi</a
			>
			<a
				href="/admin/laporan"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>Laporan Penjualan</a
			>
			<a
				href="/admin/kasir"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>Manajemen Kasir</a
			>
			<a
				href="/admin/voucher"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>Kelola Voucher</a
			>
		{:else}
			<a
				href="/transaksi"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>POS Transaksi</a
			>
			<a
				href="/barang-masuk"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100">Barang Masuk</a
			>
			<a
				href="/barang-masuk/riwayat"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100">Riwayat Stok</a
			>
			<a
				href="/transaksi/riwayat"
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100"
				>Riwayat Transaksi</a
			>
		{/if}
	</nav>
	<div class="space-y-2 border-t p-4">
		<form action="/logout" method="POST">
			{#if role === 'admin_owner'}
				<Button type="submit" class="w-full rounded-md bg-red-50 text-red-600 hover:bg-red-100">
					Logout
				</Button>
			{:else}
				<button
					type="submit"
					class="w-full rounded-md bg-red-50 p-2 text-center text-sm text-red-600 transition-colors hover:bg-red-100"
				>
					Logout
				</button>
			{/if}
		</form>
	</div>
</aside>
