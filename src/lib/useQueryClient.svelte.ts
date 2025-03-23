import type { QueryClient } from '@tanstack/query-core';

import { queryClientContext } from './context.js';

export const useQueryClient = (queryClient?: QueryClient): QueryClient => {
	if (queryClient) {
		return queryClient;
	}

	return queryClientContext.get();
};
