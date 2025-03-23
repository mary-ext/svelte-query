import { untrack } from 'svelte';
import { createEventHandler, createMemo, type ReadonlyRef } from 'svelte-freeze';

import {
	replaceEqualDeep,
	type MutationCache,
	type MutationState,
	type QueryClient,
} from '@tanstack/query-core';

import type { MutationStateOptions, QueryAccessor } from './types.js';
import { useQueryClient } from './useQueryClient.svelte.js';
import { onCleanup } from './utils.svelte.js';

const getResult = <TResult = MutationState>(
	mutationCache: MutationCache,
	options: MutationStateOptions<TResult>,
): Array<TResult> => {
	return mutationCache
		.findAll(options.filters)
		.map((mutation): TResult => (options.select ? options.select(mutation) : mutation.state) as TResult);
};

export const useMutationState = <TResult = MutationState>(
	options: QueryAccessor<MutationStateOptions<TResult>>,
	queryClient?: QueryClient,
): ReadonlyRef<Array<TResult>> => {
	return untrack(() => {
		const client = useQueryClient(queryClient);
		const mutationCache = client.getMutationCache();

		const result = createMemo(() => {
			return getResult(mutationCache, options(client));
		});

		onCleanup(
			mutationCache.subscribe(
				createEventHandler(() => {
					result.value = replaceEqualDeep(result, getResult(mutationCache, options(client)));
				}),
			),
		);

		return result;
	});
};
