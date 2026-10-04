<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		LayoutDashboard,
		Package,
		Inbox,
		RotateCw,
		Receipt,
		ChartBar,
		Users,
		Ticket,
		ShoppingCart,
		LogOut
	} from '@lucide/svelte';

	let { role = 'kasir' }: { role?: 'admin_owner' | 'kasir' | string } = $props();
</script>

<aside class="flex w-64 flex-col border-r border-blue-950 bg-blue-900 text-white shadow-sm">
	<div class="border-b border-blue-800 p-6 text-xl font-bold tracking-wider">GHANIMAH POS</div>
	<nav class="flex-1 space-y-1.5 overflow-y-auto p-4">
		{#if role === 'admin_owner'}
			<a
				href="/admin"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<LayoutDashboard size={20} /> Dashboard
			</a>
			<a
				href="/admin/produk"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<Package size={20} /> Data Produk
			</a>
			<a
				href="/admin/barang-masuk"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<Inbox size={20} /> Stok Barang Masuk
			</a>
			<a
				href="/admin/barang-masuk/riwayat"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<RotateCw size={20} /> Riwayat Stok
			</a>
			<a
				href="/admin/transaksi/riwayat"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<Receipt size={20} /> Riwayat Transaksi
			</a>
			<a
				href="/admin/laporan"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<ChartBar size={20} /> Laporan Penjualan
			</a>
			<a
				href="/admin/kasir"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<Users size={20} /> Manajemen Kasir
			</a>
			<a
				href="/admin/voucher"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<Ticket size={20} /> Kelola Voucher
			</a>
		{:else}
			<a
				href="/transaksi"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<ShoppingCart size={20} /> POS Transaksi
			</a>
			<a
				href="/barang-masuk"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<Inbox size={20} /> Barang Masuk
			</a>
			<a
				href="/barang-masuk/riwayat"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<RotateCw size={20} /> Riwayat Stok
			</a>
			<a
				href="/transaksi/riwayat"
				class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-blue-800 hover:text-blue-100"
			>
				<Receipt size={20} /> Riwayat Transaksi
			</a>
		{/if}
	</nav>
	<div class="border-t border-blue-800 p-4">
		<form action="/logout" method="POST">
			<Button type="submit" class="flex w-full items-center justify-center gap-2">
				<LogOut size={18} /> Logout
			</Button>
		</form>
	</div>
</aside>
