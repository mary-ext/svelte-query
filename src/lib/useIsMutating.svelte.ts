import { untrack } from 'svelte';
import { createEventHandler, createMemo, type ReadonlyRef } from 'svelte-freeze';

import { type MutationFilters, type QueryClient } from '@tanstack/query-core';

import type { QueryAccessor } from './types.js';
import { useQueryClient } from './useQueryClient.svelte.js';
import { onCleanup } from './utils.svelte.js';

export const useIsMutating = (
	filters?: QueryAccessor<MutationFilters>,
	queryClient: QueryClient = useQueryClient(),
): ReadonlyRef<number> => {
	return untrack(() => {
		const mutationCache = queryClient.getMutationCache();

		const mutations = createMemo(() => {
			return queryClient.isMutating(filters?.(queryClient));
		});

		onCleanup(
			mutationCache.subscribe(
				createEventHandler(() => {
					mutations.value = queryClient.isMutating(filters?.(queryClient));
				}),
			),
		);

		return mutations;
	});
};
