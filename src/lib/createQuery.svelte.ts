import { QueryObserver, type DefaultError, type QueryClient, type QueryKey } from '@tanstack/query-core';

import { createBaseQuery } from './createBaseQuery.svelte.js';
import type { DefinedInitialDataOptions, UndefinedInitialDataOptions } from './queryOptions.js';
import type {
	CreateQueryOptions,
	CreateQueryResult,
	DefinedCreateQueryResult,
	QueryAccessor,
} from './types.js';

export function createQuery<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: QueryAccessor<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>>,
	queryClient?: QueryClient,
): DefinedCreateQueryResult<TData, TError>;

export function createQuery<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: QueryAccessor<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>>,
	queryClient?: QueryClient,
): CreateQueryResult<TData, TError>;

export function createQuery<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: QueryAccessor<CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>>,
	queryClient?: QueryClient,
): CreateQueryResult<TData, TError>;

export function createQuery(options: QueryAccessor<CreateQueryOptions>, queryClient?: QueryClient) {
	return createBaseQuery(options, QueryObserver, queryClient);
}
