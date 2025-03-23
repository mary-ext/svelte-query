import { untrack } from 'svelte';
import { createEventHandler, createMemo, type ReadonlyRef } from 'svelte-freeze';

import { type MutationFilters, type QueryClient } from '@tanstack/query-core';

import type { QueryAccessor } from './types.js';
import { useQueryClient } from './useQueryClient.svelte.js';
import { onCleanup } from './utils.svelte.js';

export const useIsMutating = (
	filters?: QueryAccessor<MutationFilters>,
	queryClient?: QueryClient,
): ReadonlyRef<number> => {
	return untrack(() => {
		const client = useQueryClient(queryClient);
		const mutationCache = client.getMutationCache();

		const mutations = createMemo(() => {
			return client.isMutating(filters?.(client));
		});

		onCleanup(
			mutationCache.subscribe(
				createEventHandler(() => {
					mutations.value = client.isMutating(filters?.(client));
				}),
			),
		);

		return mutations;
	});
};
