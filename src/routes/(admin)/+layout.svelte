<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-screen bg-gray-50 text-gray-900">
	<!-- Sidebar -->
	<aside class="w-64 bg-white border-r shadow-sm flex flex-col">
		<div class="p-6 text-xl font-bold border-b">
			Ghanimah POS
		</div>
		<nav class="flex-1 p-4 space-y-2">
			<a href="/admin" class="block p-3 rounded-md hover:bg-gray-100 font-medium transition-colors">Dashboard</a>
			<a href="/admin/produk" class="block p-3 rounded-md hover:bg-gray-100 font-medium transition-colors">Data Produk</a>
			<a href="/admin/kasir" class="block p-3 rounded-md hover:bg-gray-100 font-medium transition-colors">Manajemen Kasir</a>
		</nav>
		<div class="p-4 border-t space-y-2">
			<a href="/" class="block p-2 text-sm text-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
				Buka Layar Kasir (POS)
			</a>
			<form action="/logout" method="POST">
				<button type="submit" class="w-full p-2 text-sm text-center text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
					Logout
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 p-8 overflow-auto">
		{@render children()}
	</main>
</div>
