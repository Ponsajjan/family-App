import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Member, MembersResponse } from '@/types/member';

export const membersApi = createApi({
    reducerPath: 'membersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getRelatives: builder.query<MembersResponse, { search: string; page: number; limit: number }>({
            query: ({ search, page, limit }) => ({
                url: '/relatives',
                params: { search, page, limit },
            }),
            // Merge for infinite scroll
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 1) {
                    return newItems;
                }
                currentCache.data.push(...newItems.data);
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getMembers: builder.query<
            MembersResponse,
            {
                search: string;
                page: number;
                limit: number;
                for: string;
                gender?: string | null;
                excludeId?: number[] | null;
                descendant?: boolean | null;
                showCousin?: boolean;
            }
        >({
            query: (params) => ({
                url: '/',
                params: {
                    search: params.search,
                    page: params.page,
                    limit: params.limit,
                    for: params.for,
                    gender: params.gender,
                    excludeId: params.excludeId?.join(','),
                    descendant: params.descendant,
                    showCousin: params.showCousin,
                },
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                // Different cache for different filters
                const { search, page, limit, ...filters } = queryArgs;
                return `${endpointName}-${JSON.stringify(filters)}`;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 1) {
                    return newItems;
                }
                currentCache.data.push(...newItems.data);
                currentCache.totalCount = newItems.totalCount;
                currentCache.mainMemberId = newItems.mainMemberId;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
    }),
});

export const { useGetRelativesQuery, useGetMembersQuery } = membersApi;
