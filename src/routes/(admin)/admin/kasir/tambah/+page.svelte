<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userSchema } from '$lib/schemas/user.schema';
	import { buttonVariants } from '$lib/components/ui/button';
	
	import { untrack } from 'svelte';
	
	let { data } = $props();
	
	const form = superForm(untrack(() => data.form), {
		validators: zodClient(userSchema)
	});
	const { form: formData, enhance, message } = form;
</script>

<div class="mb-6 flex items-center gap-4">
	<a href="/admin/kasir" class={buttonVariants({ variant: 'outline' })}>Kembali</a>
	<h1 class="text-3xl font-bold tracking-tight">Tambah Kasir Baru</h1>
</div>

<div class="max-w-md bg-white p-6 rounded-md border shadow-sm">
	{#if $message}
		<div class="mb-4 p-3 bg-red-100 text-red-700 rounded">
			{$message}
		</div>
	{/if}
	
	<form method="POST" use:enhance class="space-y-4">
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Nama Lengkap</Form.Label>
					<Input {...props} bind:value={$formData.name} placeholder="Misal: Budi Santoso" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="username">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Username</Form.Label>
					<Input {...props} bind:value={$formData.username} placeholder="Untuk login kasir" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} type="password" bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button class="w-full mt-6">Buat Akun Kasir</Form.Button>
	</form>
</div>
