<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { userEditSchema } from '$lib/schemas/user.schema';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ArrowLeft } from 'phosphor-svelte';
	
	import { untrack } from 'svelte';
	
	let { data } = $props();
	
	const form = superForm(untrack(() => data.form), {
		validators: zod4Client(userEditSchema)
	});
	const { form: formData, enhance, message } = form;
</script>

<div class="mb-6 flex items-center gap-4">
	<a href="/admin/kasir" class={buttonVariants({ variant: 'outline', size: 'icon' })} title="Kembali">
		<ArrowLeft class="h-5 w-5" />
	</a>
	<h1 class="text-3xl font-bold tracking-tight">Edit Kasir: {data.kasirName}</h1>
</div>

<div class="max-w-4xl bg-white p-6 rounded-md border shadow-sm">
	{#if $message}
		<div class="mb-4 p-3 bg-red-100 text-red-700 rounded">
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

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Username</Form.Label>
						<Input {...props} bind:value={$formData.username} placeholder="Untuk login kasir" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="pt-8">
				<div class="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
					ℹ️ <strong>Reset Password:</strong> Sesuai SOP, perubahan password akun kasir dilakukan oleh admin secara langsung melalui database manual.
				</div>
			</div>
		</div>

		<div class="flex justify-end pt-4 border-t mt-6">
			<Form.Button class="w-full md:w-auto px-8">Update Profil</Form.Button>
		</div>
	</form>
</div>

