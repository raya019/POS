<script lang="ts">
	import { BarangMasukView } from '$lib';
	let { data } = $props();
</script>

<BarangMasukView {data} postUrl="/barang-masuk" />
