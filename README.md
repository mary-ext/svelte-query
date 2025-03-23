# @mary-ext/svelte-query

https://github.com/TanStack/query/tree/6c9d7a7c2b7cc93ab5d003d09faabbdafa2414df/packages/svelte-query/src

my own Svelte adapter for TanStack Query

- Written for Svelte 5.
- Doesn't make use of deep reactivity, `$state.snapshot()` is not required.
- Integrates with [svelte-freeze](https://github.com/mary-ext/svelte-freeze).
- No server-side support.

```svelte
<script>
	import { createQuery } from '@mary-ext/svelte-query';

	const query = createQuery(() => ({
		queryKey: ['todos'],
		queryFn: fetchTodos,
	}));
</script>

{#if query.isLoading}
	<div>Loading...</div>
{:else if query.isError}
	<div>Error: {query.error.message}</div>
{:else}
	<ul>
		{#each query.data as todo}
			<li>{todo.title}</li>
		{/each}
	</ul>
{/if}
```
