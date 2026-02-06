import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface TreeData {
    // Define tree data structure based on prisma schema if needed
    [key: string]: any;
}

export const treeApi = createApi({
    reducerPath: 'treeApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/tree/get_chart' }),
    endpoints: (builder) => ({
        getFamilyTree: builder.query<any[], void>({
            query: () => '/',
        }),
    }),
});

export const { useGetFamilyTreeQuery } = treeApi;
