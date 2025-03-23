import type { Ref } from 'svelte-freeze';

export const noop = () => {};

export const onCleanup = (fn: () => void) => {
	$effect(() => {
		return fn;
	});
};

export const createState: {
	<T>(): Ref<T | undefined>;
	<T>(initialValue: T): Ref<T>;
} = <T>(initialValue?: T): Ref<T | undefined> => {
	let state = $state.raw(initialValue);

	return {
		get value() {
			return state;
		},
		set value(next) {
			state = next;
		},
	};
};

export const createStateObject = <T extends Record<string, any>>(obj: T): T => {
	const state = {} as T;

	for (const key in obj) {
		let value = $state.raw(obj[key]);

		Object.defineProperty(state, key, {
			get() {
				return value;
			},
			set(newValue) {
				value = newValue;
			},
		});
	}

	return state;
};
