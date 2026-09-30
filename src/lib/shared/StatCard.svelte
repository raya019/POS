<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	let { title, value } = $props<{ title: string; value: string | number }>();
</script>

<Card.Root>
	<Card.Header class="pb-2">
		<Card.Title class="text-sm font-medium text-gray-500">{title}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{value}</div>
	</Card.Content>
</Card.Root>
