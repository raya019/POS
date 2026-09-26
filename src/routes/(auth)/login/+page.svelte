<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';

	let username = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		errorMessage = '';
		
		const { data, error } = await authClient.signIn.username({
			username,
			password,
		});
		
		loading = false;
		if (error) {
			errorMessage = error.message || 'Login gagal. Periksa kembali username dan password.';
		} else {
			// Arahkan ke /admin atau / tergantung role, kita arahkan ke root dan biarkan proteksi layout yang redirect
			goto('/');
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
	<Card.Root class="w-full max-w-sm shadow-md">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl font-bold text-center">Ghanimah POS</Card.Title>
			<Card.Description class="text-center">Silakan login untuk melanjutkan</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if errorMessage}
				<div class="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
					{errorMessage}
				</div>
			{/if}
			<form onsubmit={handleLogin} class="space-y-4">
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input id="username" type="text" bind:value={username} required placeholder="Masukkan username" />
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} required placeholder="Masukkan password" />
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Memproses...' : 'Masuk'}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
