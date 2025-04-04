import { type QueryClient, type QueryFilters } from '@tanstack/query-core';

import { untrack } from 'svelte';
import { createEventHandler, createMemo, type ReadonlyRef } from 'svelte-freeze';

import type { QueryAccessor } from './types.js';
import { useQueryClient } from './useQueryClient.svelte.js';
import { onCleanup } from './utils.svelte.js';

export const useIsFetching = (
	filters?: QueryAccessor<QueryFilters>,
	queryClient: QueryClient = useQueryClient(),
): ReadonlyRef<number> => {
	return untrack(() => {
		const queryCache = queryClient.getQueryCache();

		const queries = createMemo(() => {
			return queryClient.isFetching(filters?.(queryClient));
		});

		onCleanup(
			queryCache.subscribe(
				createEventHandler(() => {
					queries.value = queryClient.isFetching(filters?.(queryClient));
				}),
			),
		);

		return queries;
	});
};
