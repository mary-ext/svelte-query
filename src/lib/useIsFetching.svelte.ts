import { type QueryClient, type QueryFilters } from '@tanstack/query-core';

import { untrack } from 'svelte';
import { createEventHandler, createMemo, type ReadonlyRef } from 'svelte-freeze';

import type { QueryAccessor } from './types.js';
import { useQueryClient } from './useQueryClient.svelte.js';
import { onCleanup } from './utils.svelte.js';

export const useIsFetching = (
	filters?: QueryAccessor<QueryFilters>,
	queryClient?: QueryClient,
): ReadonlyRef<number> => {
	return untrack(() => {
		const client = useQueryClient(queryClient);
		const queryCache = client.getQueryCache();

		const queries = createMemo(() => {
			return client.isFetching(filters?.(client));
		});

		onCleanup(
			queryCache.subscribe(
				createEventHandler(() => {
					queries.value = client.isFetching(filters?.(client));
				}),
			),
		);

		return queries;
	});
};
