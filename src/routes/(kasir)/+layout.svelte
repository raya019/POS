<script lang="ts">
	import { AppSidebar, PageHeader } from '$lib';

	let { data, children } = $props();
</script>

<div class="flex h-screen bg-gray-50 text-gray-900">
	<AppSidebar role={data.user.role} />

	<main class="flex-1 overflow-auto bg-gray-100 p-6">
		<PageHeader user={data.user} />
		{@render children()}
	</main>
</div>
