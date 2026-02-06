import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CalendarMonthlyEvent {
    id: string;
    name: string;
    date: string; // ISO string
    type: 'birthday' | 'deathday';
    hasDate: boolean;
    age: number | string;
}

export interface EventDatesValue {
    pastEvents: CalendarMonthlyEvent[];
    todayEvents: CalendarMonthlyEvent[];
    tomorrowEvents: CalendarMonthlyEvent[];
    thisWeekEvents: CalendarMonthlyEvent[];
    upcomingEvents: CalendarMonthlyEvent[];
    selectedMonthEvents: CalendarMonthlyEvent[];
    datesList: number[];
}

export interface CalendarResponse {
    eventDates: EventDatesValue;
    datesList: number[];
}

export const calendarApi = createApi({
    reducerPath: 'calendarApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/calendar' }),
    endpoints: (builder) => ({
        getCalendarEvents: builder.query<CalendarResponse, { month: number; year: number }>({
            query: ({ month, year }) => `${month}/${year}`,
            // Keep data for 10 minutes to avoid repeated fetches when navigating between months
            keepUnusedDataFor: 600,
        }),
    }),
});

export const { useGetCalendarEventsQuery } = calendarApi;
