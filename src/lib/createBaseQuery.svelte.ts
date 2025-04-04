import { untrack } from 'svelte';
import { createEventHandler, createMemo, useIsFrozen } from 'svelte-freeze';

import type { QueryClient, QueryKey, QueryObserver } from '@tanstack/query-core';

import type { CreateBaseQueryOptions, CreateBaseQueryResult, QueryAccessor } from './types.js';
import { useQueryClient } from './useQueryClient.svelte.js';
import { createStateObject, onCleanup } from './utils.svelte.js';

export const createBaseQuery = <TQueryFnData, TError, TData, TQueryData, TQueryKey extends QueryKey>(
	options: QueryAccessor<CreateBaseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>>,
	Observer: typeof QueryObserver,
	queryClient: QueryClient = useQueryClient(),
): CreateBaseQueryResult<TData, TError> => {
	return untrack(() => {
		const isFrozen = useIsFrozen();

		const defaultedOptions = createMemo(() => {
			return queryClient.defaultQueryOptions(options(queryClient));
		});

		const initialDefaultedOptions = defaultedOptions.value;

		const observer = new Observer<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
			queryClient,
			initialDefaultedOptions,
		);

		const result = createStateObject(observer.getOptimisticResult(initialDefaultedOptions));

		let init = false;
		$effect(() => {
			let options = defaultedOptions.value;
			if (isFrozen()) {
				options = { ...options, enabled: false };
			}

			if (init) {
				untrack(() => observer.setOptions(options));
			}

			init = true;
		});

		onCleanup(
			observer.subscribe(
				createEventHandler((next) => {
					Object.assign(result, next);
				}),
			),
		);

		observer.updateResult();

		return result;
	});
};
