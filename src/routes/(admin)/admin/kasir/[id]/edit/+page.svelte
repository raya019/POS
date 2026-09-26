<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userEditSchema } from '$lib/schemas/user.schema.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	import { untrack } from 'svelte';
	let { data } = $props();

	const form = superForm(untrack(() => data.form), {
		validators: zodClient(userEditSchema)
	});
	const { form: formData, enhance, message } = form;
</script>

<div class="mb-6 flex items-center gap-4">
	<a href="/admin/kasir" class={buttonVariants({ variant: 'outline' })}>Kembali</a>
	<h1 class="text-3xl font-bold tracking-tight">Edit Kasir: {data.kasirName}</h1>
</div>

<div class="max-w-md rounded-md border bg-white p-6 shadow-sm">
	{#if $message}
		<div class="mb-4 rounded bg-red-100 p-3 text-red-700">
			{$message}
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-4">
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Nama Lengkap</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="username">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Username</Form.Label>
					<Input {...props} bind:value={$formData.username} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
			ℹ️ <strong>Reset Password:</strong> Sesuai SOP, perubahan password akun kasir dilakukan oleh admin
			secara langsung melalui database manual.
		</div>

		<Form.Button class="mt-6 w-full">Update Profil</Form.Button>
	</form>
</div>
