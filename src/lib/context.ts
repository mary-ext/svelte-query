import { Context } from 'runed';

import type { QueryClient } from '@tanstack/query-core';

export const queryClientContext = new Context<QueryClient>('svelte-query');
