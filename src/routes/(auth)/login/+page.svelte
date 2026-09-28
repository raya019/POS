<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { LoginSchema } from '$lib/schemas/login.schema.js';
	import { untrack } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	const form = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(LoginSchema),
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

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
	<Card.Root class="w-full max-w-sm shadow-md">
		<Card.Header class="space-y-1">
			<Card.Title class="text-center text-2xl font-bold">Ghanimah POS</Card.Title>
			<Card.Description class="text-center">Silakan login untuk melanjutkan</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance>
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input {...props} bind:value={$formData.username} placeholder="Masukkan username" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input
								{...props}
								type="password"
								placeholder="******"
								bind:value={$formData.password}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="mt-4 w-full">Masuk</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
