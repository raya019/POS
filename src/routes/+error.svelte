<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 text-center">
	<p class="text-4xl font-bold text-gray-900">{page.status}</p>
	<p class="mb-4 text-lg text-muted-foreground">
		{page.error?.message ?? 'Terjadi kesalahan yang tidak terduga'}
	</p>
</div>
