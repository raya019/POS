<script lang="ts">
	let { data } = $props();
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
</script>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-3xl font-bold tracking-tight">Manajemen Kasir</h1>
	<a href="/admin/kasir/tambah" class={buttonVariants()}>Tambah Kasir</a>
</div>

<div class="rounded-md border bg-white">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Nama Lengkap</Table.Head>
				<Table.Head>Username</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.users as u (u.id)}
				<Table.Row>
					<Table.Cell class="font-medium">{u.name}</Table.Cell>
					<Table.Cell>{u.username}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={2} class="h-24 text-center">Belum ada akun kasir terdaftar.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
