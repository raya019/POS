<script lang="ts">
	import { RiwayatTransaksiView } from '$lib';
	let { data } = $props();
</script>

<RiwayatTransaksiView {data} notaUrlPrefix="/admin/nota" />
