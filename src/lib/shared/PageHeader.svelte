<script lang="ts">
	let { user } = $props<{ user: { name: string; role: string; username: string } }>();
</script>

<header class="mb-6 flex items-center justify-between border-b pb-4">
	<div class="text-sm font-medium text-gray-500">
		<span class="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 uppercase">{user.role}</span>
	</div>
	<div class="text-sm text-gray-600">
		Selamat datang, <span class="font-bold text-gray-900">{user.name || user.username}</span>
	</div>
</header>
