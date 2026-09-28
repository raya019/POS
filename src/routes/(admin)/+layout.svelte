<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-screen bg-gray-50 text-gray-900">
	<!-- Sidebar -->
	<aside class="flex w-64 flex-col border-r bg-white shadow-sm">
		<div class="border-b p-6 text-xl font-bold">Ghanimah POS</div>
		<nav class="flex-1 space-y-2 p-4">
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
				class="block rounded-md p-3 font-medium transition-colors hover:bg-gray-100">Riwayat Transaksi</a
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
		</nav>
		<div class="space-y-2 border-t p-4">
			<form action="/logout" method="POST">
				<button
					type="submit"
					class="w-full rounded-md bg-red-50 p-2 text-center text-sm text-red-600 transition-colors hover:bg-red-100"
				>
					Logout
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto p-8">
		{@render children()}
	</main>
</div>
