<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { userEditSchema } from '$lib/schemas/user.schema.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';

	let { data } = $props();

	const form = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(userEditSchema),
			async onSubmit({ cancel }) {
				const result = await validateForm();
				if (!result.valid) cancel();
			},
			onUpdate: ({ form, result }) => {
				if (result.type === 'success') {
					toast.success('Login berhasil');
				} else {
					toast.error(form.message);
				}
			}
		}
	);
	const { form: formData, enhance, validateForm } = form;
</script>

<div class="mb-6 flex items-center gap-4">
	<a
		href="/admin/kasir"
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		title="Kembali"
	>
		<ArrowLeft class="h-5 w-5" />
	</a>
	<h1 class="text-3xl font-bold tracking-tight">Edit Kasir: {data.kasirName}</h1>
</div>

<div class="max-w-4xl rounded-md border bg-white p-6 shadow-sm">
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

			<div class="pt-8">
				<div class="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
					ℹ️ <strong>Reset Password:</strong> Sesuai SOP, perubahan password akun kasir dilakukan oleh
					admin secara langsung melalui database manual.
				</div>
			</div>
		</div>

		<div class="mt-6 flex justify-end border-t pt-4">
			<Form.Button class="w-full px-8 md:w-auto">Update Profil</Form.Button>
		</div>
	</form>
</div>
