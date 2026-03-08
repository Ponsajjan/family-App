"use client";

import Topnav from "@/components/Topnav";
import { Announcement, CloseIcon, SkipBack, SkipForward } from "@/utils/Icons";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import CalendarMonthlyData from "../components/CalendarMonthlyData";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import OnDate from "../components/OnDate";
import { format } from 'date-fns';
import { useToast } from '@/components/Toast';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CalendarMemberDetail from "../components/CalendarMemberDetail";
// import { useDailyNotifications } from "@/utils/notificationUtils";

// Helper function to get current date in IST
const getCurrentIndiaDate = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

// Helper function to check if a date is today
const isToday = (date: Date) => {
  const today = getCurrentIndiaDate();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

interface CalendarMonthlyEvent {
  id: string;
  name: string;
  date: Date;
  type: 'birthday' | 'deathday';
  hasDate: boolean;
  age: number | string;
}

interface EventDatesValue {
  pastEvents: CalendarMonthlyEvent[];
  todayEvents: CalendarMonthlyEvent[];
  tomorrowEvents: CalendarMonthlyEvent[];
  thisWeekEvents: CalendarMonthlyEvent[];
  upcomingEvents: CalendarMonthlyEvent[];
  selectedMonthEvents: CalendarMonthlyEvent[];
  datesList: number[];
}

export default function Calendar() {
  const toast = useToast();
  const router = useRouter();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentIndiaDate = getCurrentIndiaDate();
  const [calendarDate, setCalendarDate] = useState(currentIndiaDate);
  const [eventDatesValue, setEventDatesValue] = useState<EventDatesValue | any>({});
  const [datesList, setDatesList] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth(); // 0-indexed

  const currentMonth = currentIndiaDate.getMonth();
  const currentYear = currentIndiaDate.getFullYear();

  const totalMonthDiff = (year - currentYear) * 12 + (month - currentMonth);
  const isFuture = totalMonthDiff >= 2;
  const isPast = totalMonthDiff <= -2;

  const [selectedDate, setSelectedDate] = useState('');
  const [eventForDate, setEventForDate] = useState<CalendarMonthlyEvent[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showPopupFor, setShowPopupFor] = useState<'member' | 'date' | null>(null);
  const { logout } = useAuth();

  // Use the notification hook
  // const { checkAndSendNotifications } = useDailyNotifications();

  // Helper functions for first/last day of the month
  function getFirstDayOfMonth(year: number, month: number) {
    const selectMonth = new Date(year, month, 1);
    const istDay = new Date(selectMonth).getDay();
    return istDay === 0 ? 6 : istDay - 1;
  }

  function getLastDayOfMonth(year: number, month: number) {
    const lastDay = new Date(year, month + 1, 0);
    return new Date(lastDay);
  }

  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const lastDayOfMonth = getLastDayOfMonth(year, month);
  const emptyCells = 7 - lastDayOfMonth.getDay();

  let emptyCellsCount;

  if (emptyCells < 7) {
    emptyCellsCount = emptyCells;
  } else {
    emptyCellsCount = 0;
  }

  const showEventForDate = (date: number) => {
    if (!datesList.includes(date)) {
      return;
    }

    // Create date in IST
    const selectedDateIST = new Date(year, month, date);
    setSelectedDate(selectedDateIST.toISOString());

    const {
      pastEvents = [],
      todayEvents = [],
      tomorrowEvents = [],
      thisWeekEvents = [],
      upcomingEvents = [],
      selectedMonthEvents = [],
    } = eventDatesValue;

    // Combine all events from different categories
    const allEvents = [
      ...pastEvents,
      ...todayEvents,
      ...tomorrowEvents,
      ...thisWeekEvents,
      ...upcomingEvents,
      ...selectedMonthEvents
    ];

    // Filter events for the selected date
    const filtered = allEvents.filter((event) => {
      try {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date &&
          eventDate.getMonth() === month
        );
      } catch (error) {
        return false;
      }
    });
    // setSelectedMemberId(null)
    setEventForDate(filtered);
    setShowPopup(true);
  };

  // Handlers for previous/next month navigation
  function getPreviousMonth() {
    setLoading(true);
    setShowPopup(false);
    const previousMonth = new Date(calendarDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCalendarDate(new Date(previousMonth));
  }

  function getNextMonth() {
    setLoading(true);
    setShowPopup(false);
    const nextMonth = new Date(calendarDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarDate(new Date(nextMonth));
  }

  function resetToCurrentMonth() {
    setLoading(true);
    setShowPopup(false);
    setCalendarDate(currentIndiaDate);
  }

  useEffect(() => {
    async function fetchEventDates() {
      try {
        // Use month+1 since the API expects 1-12 but Date uses 0-11
        const response = await fetch(`/api/calendar/${month + 1}/${year}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        // Handle 401 Unauthorized
        if (response.status === 401) {
          logout();
          return;
        }
        // Check if the response was successful
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const { eventDates, datesList } = await response.json();
        setEventDatesValue(eventDates);
        setDatesList(datesList);

        // Check for today's events and send notification once per day
        const todayEvents = eventDates.todayEvents || [];
        if (todayEvents.length > 0) {
          // Use the notification hook to handle daily notifications
          // checkAndSendNotifications(todayEvents);

          // Show popup if there is event today
          const todayDateObj = new Date();
          setSelectedDate(todayDateObj.toISOString());
          setEventForDate(todayEvents);
          setShowPopupFor('date');
          setShowPopup(true);
        }

      } catch (error: any) {
        toast?.show(error.message || "Failed to fetch event dates.", "error", 5000);
      } finally {
        setLoading(false);
      }
    }

    fetchEventDates();
  }, [month, year, toast, logout, router]); //checkAndSendNotifications

  const HandlePopupData = (event: 'member' | 'date', data: any) => {
    if (event === 'member') {
      setSelectedMemberId(data);
      setShowPopupFor('member');
      setShowPopup(true);
    }
    if (event === 'date' && datesList?.includes(data)) {
      showEventForDate(data);
      setShowPopupFor('date');
      setShowPopup(true);
    }
    return
  }

  return (
    <div className="w-full min-h-screen bg-transparent">
      <Topnav>
        {(isFuture || isPast) && (
          <button
            onClick={resetToCurrentMonth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-dark border-accent_color/30 text-accent_color hover:bg-accent_color hover:text-accent_contrast transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-accent_color/20"
            title="Jump to Current Month"
          >
            {isFuture ? <SkipBack /> : <SkipForward />}
            <span>Current Month</span>
          </button>
        )}
      </Topnav>

      <div className="lg:flex p-4 md:p-8 gap-8">
        <div className="flex-1 max-w-4xl">
          <div className="glass rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/10">
            {/* Calendar Header */}
            <div className="px-6 py-8 flex items-center justify-between border-b border-border_color/20 bg-accent_color/5 backdrop-blur-md">
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold tracking-tight text-text_color">
                  {moment(calendarDate).tz("Asia/Kolkata").format("MMMM")}
                </h2>
                <span className="text-accent_color font-medium tracking-widest text-sm uppercase">
                  {moment(calendarDate).tz("Asia/Kolkata").format("YYYY")}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={getPreviousMonth}
                  className="p-2.5 rounded-xl glass hover:bg-accent_color hover:text-accent_contrast transition-all duration-300 shadow-sm active:scale-95"
                >
                  <SkipBack />
                </button>
                <button
                  onClick={getNextMonth}
                  className="p-2.5 rounded-xl glass hover:bg-accent_color hover:text-accent_contrast transition-all duration-300 shadow-sm active:scale-95"
                >
                  <SkipForward />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 md:p-6 bg-transparent">
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-xs font-bold uppercase tracking-widest text-text_color/40 pb-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {/* Render Empty Cells Before 1st of Month */}
                {Array.from({ length: firstDayOfMonth }, (_, index) => (
                  <div key={`empty-prev-${index}`} className="aspect-square rounded-2xl bg-field_hover/30 opacity-40"></div>
                ))}

                {/* Render Days of Month */}
                {Array.from({ length: lastDayOfMonth.getDate() }, (_, index) => {
                  const date = index + 1;
                  const cellDate = new Date(year, month, date);
                  const cellIsToday = isToday(cellDate);
                  const hasEvents = datesList?.includes(date);

                  return (
                    <div
                      key={date}
                      onClick={() => HandlePopupData('date', date)}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-300 group
                        ${cellIsToday
                          ? "bg-accent_color text-accent_contrast shadow-lg shadow-accent_color/30 ring-4 ring-accent_color/10 scale-105 z-10"
                          : "glass-dark hover:bg-field_hover hover:scale-105 hover:shadow-md"
                        }
                      `}
                    >
                      <span className={`text-base md:text-xl font-semibold ${cellIsToday ? "text-accent_contrast" : "text-text_color"}`}>
                        {date}
                      </span>

                      {hasEvents && !loading && (
                        <div className={`
                          absolute bottom-3 w-1.5 h-1.5 rounded-full
                          ${cellIsToday ? "bg-white shadow-[0_0_8px_white]" : "bg-accent_color shadow-[0_0_8px_rgba(var(--accent-color),0.5)]"}
                        `} />
                      )}

                      {/* Hover effect highlight */}
                      {!cellIsToday && (
                        <div className="absolute inset-0 rounded-2xl bg-accent_color/0 group-hover:bg-accent_color/5 transition-colors duration-300" />
                      )}
                    </div>
                  );
                })}

                {/* Render Empty Cells After Last Day of Month */}
                {Array.from({ length: emptyCellsCount }, (_, index) => (
                  <div key={`empty-next-${index}`} className="aspect-square rounded-2xl bg-field_hover/30 opacity-40"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Overlay Background */}
          <div onClick={() => setShowPopup(false)} className={`fixed md:hidden inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

          {/* Popup Panel */}
          <div className={`
            md:static z-[101] fixed left-0 right-0 bottom-0 bg-transparent md:mt-12 transition-all duration-500 ease-in-out
            ${showPopup
              ? 'translate-y-0 opacity-100 visible'
              : 'translate-y-full opacity-0 invisible md:translate-y-0 md:opacity-100 md:visible'
            }
          `}>
            <div className="glass border-t md:border border-border_color/20 rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border_color/10">
                {showPopupFor === 'date' && (() => {
                  const selected = new Date(selectedDate);
                  const selectedIsToday = isToday(selected);
                  return (
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-accent_color/10 text-accent_color">
                        <Announcement />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-widest text-accent_color">
                          {selectedIsToday ? "Occurring Today" : "Events for Date"}
                        </span>
                        <h3 className="text-xl font-bold text-text_color">
                          {format(selected, 'EEEE, d MMM yyyy')}
                        </h3>
                      </div>
                    </div>
                  );
                })()}
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 rounded-xl hover:bg-field_hover transition-colors text-text_color/60"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="max-h-[60vh] md:max-h-none overflow-y-auto custom-scrollbar">
                {showPopupFor === 'date' && <OnDate events={eventForDate} />}
                {showPopupFor === 'member' && <CalendarMemberDetail memberId={selectedMemberId} />}
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-[400px] mt-12 lg:mt-0">
          <div className="sticky top-24">
            <h3 className="text-lg font-bold text-text_color/60 uppercase tracking-widest mb-6 px-2">
              All Monthly Events
            </h3>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 glass rounded-3xl animate-pulse" />)}
              </div>
            ) : datesList?.length > 0 ? (
              <CalendarMonthlyData eventDatesValue={eventDatesValue} month={month} year={year} setSelectedMemberId={HandlePopupData} />
            ) : (
              <div className="glass rounded-[2rem] p-8 text-center text-text_color/50 border-dashed border-2 border-border_color/30">
                No events scheduled for this month
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
