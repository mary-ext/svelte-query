export * from '@tanstack/query-core';

export * from './types.js';

export { infiniteQueryOptions } from './infiniteQueryOptions.js';
export {
	queryOptions,
	type DefinedInitialDataOptions,
	type UndefinedInitialDataOptions,
} from './queryOptions.js';

export { default as QueryClientProvider } from './QueryClientProvider.svelte';
export { useQueryClient } from './useQueryClient.svelte.js';

export { createInfiniteQuery } from './createInfiniteQuery.svelte.js';
export { createMutation } from './createMutation.svelte.js';
export { createQueries, type QueriesOptions, type QueriesResults } from './createQueries.svelte.js';
export { createQuery } from './createQuery.svelte.js';
export { useIsFetching } from './useIsFetching.svelte.js';
export { useIsMutating } from './useIsMutating.svelte.js';
export { useMutationState } from './useMutationState.svelte.js';
