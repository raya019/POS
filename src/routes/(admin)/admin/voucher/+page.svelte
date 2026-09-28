<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let { data } = $props();

	const formatRupiah = (val: number) =>
		new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(val);

	const formatDate = (dateString: string | null) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('id-ID');
	};

	const checkStatus = (validFrom: string | null, validUntil: string | null) => {
		const now = new Date();
		// Set jam ke 00:00:00 untuk komparasi tanggal
		now.setHours(0, 0, 0, 0);

		if (validFrom && new Date(validFrom) > now) return 'Belum Berlaku';
		if (validUntil && new Date(validUntil) < now) return 'Kedaluwarsa';
		return 'Berlaku';
	};
</script>

<div class="mb-6 flex items-center justify-between">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Kelola Voucher</h1>
		<p class="text-gray-500">Daftar kode promo diskon yang dapat digunakan kasir.</p>
	</div>
	<a href="/admin/voucher/tambah" class={buttonVariants()}>Tambah Voucher Baru</a>
</div>

<div class="rounded-md border bg-white shadow-sm">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Kode</Table.Head>
				<Table.Head>Jenis Diskon</Table.Head>
				<Table.Head>Nilai</Table.Head>
				<Table.Head>Min. Beli</Table.Head>
				<Table.Head>Masa Berlaku</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head class="text-right">Aksi</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.vouchers as v (v.id)}
				{@const status = checkStatus(v.validFrom, v.validUntil)}
				<Table.Row>
					<Table.Cell class="font-bold">{v.code}</Table.Cell>
					<Table.Cell>{v.discountType === 'percent' ? 'Persentase (%)' : 'Nominal (Rp)'}</Table.Cell
					>
					<Table.Cell class="font-medium text-blue-700">
						{v.discountType === 'percent' ? `${v.discountValue}%` : formatRupiah(v.discountValue)}
					</Table.Cell>
					<Table.Cell>{v.minPurchase ? formatRupiah(v.minPurchase) : '-'}</Table.Cell>
					<Table.Cell>
						{formatDate(v.validFrom)} s/d {formatDate(v.validUntil)}
					</Table.Cell>
					<Table.Cell>
						<span
							class="rounded-full px-2 py-1 text-xs font-semibold
							{status === 'Berlaku' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}"
						>
							{status}
						</span>
					</Table.Cell>
					<Table.Cell class="text-right">
						<div class="flex items-center justify-end gap-2">
							<a
								href="/admin/voucher/{v.id}/edit"
								class={buttonVariants({ variant: 'outline', size: 'sm' })}
							>
								Edit
							</a>
							<AlertDialog.Root>
								<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive', size: 'sm' })}>Hapus</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Hapus Voucher {v.code}?</AlertDialog.Title>
										<AlertDialog.Description>
											Tindakan ini tidak dapat dibatalkan. Voucher ini akan dihapus secara permanen dan tidak dapat digunakan lagi.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
										<form method="POST" action="?/delete" use:enhance>
											<input type="hidden" name="id" value={v.id} />
											<AlertDialog.Action type="submit" class="bg-red-600 hover:bg-red-700 text-white">
												Ya, Hapus
											</AlertDialog.Action>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={7} class="h-24 text-center text-gray-500">
						Belum ada voucher yang dibuat.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
