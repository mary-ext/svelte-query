import { untrack } from 'svelte';
import { createEffect, createEventHandler, createMemo } from 'svelte-freeze';

import { MutationObserver, type DefaultError, type QueryClient } from '@tanstack/query-core';

import type {
	CreateMutateFunction,
	CreateMutationOptions,
	CreateMutationResult,
	QueryAccessor,
} from './types.js';
import { useQueryClient } from './useQueryClient.svelte.js';
import { createStateObject, noop, onCleanup } from './utils.svelte.js';

export const createMutation = <TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
	options: QueryAccessor<CreateMutationOptions<TData, TError, TVariables, TContext>>,
	queryClient: QueryClient = useQueryClient(),
): CreateMutationResult<TData, TError, TVariables, TContext> => {
	return untrack(() => {
		const defaultedOptions = createMemo(() => {
			return queryClient.defaultMutationOptions(options(queryClient));
		});

		const initialDefaultedOptions = defaultedOptions.value;

		const observer = new MutationObserver<TData, TError, TVariables, TContext>(
			queryClient,
			initialDefaultedOptions,
		);

		const mutate: CreateMutateFunction<TData, TError, TVariables, TContext> = (variables, mutateOptions) => {
			observer.mutate(variables, mutateOptions).catch(noop);
		};

		const initialResult = observer.getCurrentResult();
		const result = createStateObject({
			...initialResult,
			mutate: mutate,
			mutateAsync: initialResult.mutate,
		});

		let init = false;
		createEffect(() => {
			const options = defaultedOptions.value;
			if (init) {
				untrack(() => observer.setOptions(options));
			}

			init = true;
		});

		onCleanup(
			observer.subscribe(
				createEventHandler((next) => {
					Object.assign(result, {
						...next,
						mutate: mutate,
						mutateAsync: result.mutate,
					});
				}),
			),
		);

		return result;
	});
};
