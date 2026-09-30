<script lang="ts">
	import { BarangMasukView } from '$lib';
	let { data } = $props();
</script>

<BarangMasukView {data} postUrl="/admin/barang-masuk" />
