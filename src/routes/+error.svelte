<script lang="ts">
	import { page } from '$app/state';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
	{#if page.status === 404}
		<div class="max-w-md rounded-lg border bg-white p-8 shadow-sm">
			<span
				class="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800"
			>
				Error 404 • Not Found
			</span>
			<h1 class="mt-4 text-2xl font-bold text-gray-900">Halaman Tidak Ditemukan</h1>
			<p class="mt-2 text-sm text-gray-600">
				{page.error?.message || 'Maaf, halaman atau data yang Anda tuju tidak tersedia di sistem.'}
			</p>
			<div class="mt-6 flex justify-center gap-3">
				<button
					type="button"
					onclick={() => history.back()}
					class={buttonVariants({ variant: 'outline' })}
				>
					Kembali
				</button>
				<a href="/" class={buttonVariants({ variant: 'default' })}>Ke Halaman Utama</a>
			</div>
		</div>
	{:else}
		<div class="max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-sm">
			<span
				class="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800"
			>
				Error {page.status} • Server Error
			</span>
			<h1 class="mt-4 text-2xl font-bold text-gray-900">Terjadi Kesalahan pada Server</h1>
			<p class="mt-2 text-sm text-gray-600">
				{page.error?.message ||
					'Terjadi kesalahan yang tidak terduga pada server. Silakan coba lagi atau hubungi administrator.'}
			</p>
			<div class="mt-6 flex justify-center gap-3">
				<button
					type="button"
					onclick={() => location.reload()}
					class={buttonVariants({ variant: 'outline' })}
				>
					Muat Ulang
				</button>
				<a href="/" class={buttonVariants({ variant: 'default' })}>Ke Halaman Utama</a>
			</div>
		</div>
	{/if}
</div>
