<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { userSchema } from '$lib/schemas/user.schema';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ArrowLeft } from '@lucide/svelte';

	import { untrack } from 'svelte';

	let { data } = $props();

	const form = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(userSchema)
		}
	);
	const { form: formData, enhance, message } = form;
</script>

<div class="mb-6 flex items-center gap-4">
	<a
		href="/admin/kasir"
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		title="Kembali"
	>
		<ArrowLeft class="h-5 w-5" />
	</a>
	<h1 class="text-3xl font-bold tracking-tight">Tambah Kasir Baru</h1>
</div>

<div class="max-w-4xl rounded-md border bg-white p-6 shadow-sm">
	{#if $message}
		<div class="mb-4 rounded bg-red-100 p-3 text-red-700">
			{$message}
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-6">
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Nama Lengkap</Form.Label>
					<Input {...props} bind:value={$formData.name} placeholder="Misal: Budi Santoso" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
		</div>

		<div class="mt-6 flex justify-end border-t pt-4">
			<Form.Button class="w-full px-8 md:w-auto">Buat Akun Kasir</Form.Button>
		</div>
	</form>
</div>
