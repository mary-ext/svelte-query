import {
	InfiniteQueryObserver,
	type DefaultError,
	type InfiniteData,
	type QueryClient,
	type QueryKey,
	type QueryObserver,
} from '@tanstack/query-core';

import { createBaseQuery } from './createBaseQuery.svelte.js';
import type { CreateInfiniteQueryOptions, CreateInfiniteQueryResult, QueryAccessor } from './types.js';

export const createInfiniteQuery = <
	TQueryFnData,
	TError = DefaultError,
	TData = InfiniteData<TQueryFnData>,
	TQueryKey extends QueryKey = QueryKey,
	TPageParam = unknown,
>(
	options: QueryAccessor<
		CreateInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, TPageParam>
	>,
	queryClient?: QueryClient,
): CreateInfiniteQueryResult<TData, TError> => {
	return createBaseQuery(
		options,
		InfiniteQueryObserver as typeof QueryObserver,
		queryClient,
	) as CreateInfiniteQueryResult<TData, TError>;
};
