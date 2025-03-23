<script lang="ts">
	import { type Snippet } from 'svelte';

	import { QueryClient } from '@tanstack/query-core';

	import { queryClientContext } from './context.js';

	interface Props {
		client: QueryClient;
		children: Snippet<[]>;
	}

	const { client, children }: Props = $props();

	const captured = client;

	queryClientContext.set(captured);

	$effect(() => {
		captured.mount();
		return () => captured.unmount();
	});
</script>

{@render children()}
