<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-screen bg-gray-50 text-gray-900">
	<!-- Sidebar Kasir -->
	<aside class="flex w-64 flex-col border-r bg-white shadow-sm">
		<div class="border-b p-6 text-xl font-bold text-blue-700">Ghanimah POS</div>
		<nav class="flex-1 space-y-2 p-4">
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
	<main class="flex-1 overflow-auto bg-gray-100 p-6">
		{@render children()}
	</main>
</div>
