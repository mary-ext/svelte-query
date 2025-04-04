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
	queryClient: QueryClient = useQueryClient(),
): ReadonlyRef<Array<TResult>> => {
	return untrack(() => {
		const mutationCache = queryClient.getMutationCache();

		const result = createMemo(() => {
			return getResult(mutationCache, options(queryClient));
		});

		onCleanup(
			mutationCache.subscribe(
				createEventHandler(() => {
					result.value = replaceEqualDeep(result, getResult(mutationCache, options(queryClient)));
				}),
			),
		);

		return result;
	});
};
