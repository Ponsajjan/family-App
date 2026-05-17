"use client";

import Topnav from "@/components/Topnav";
import { Announcement, CloseIcon, SkipBack, SkipForward } from "@/utils/Icons";
import { useEffect, useState, useMemo } from "react";
import useSWR from 'swr';
import moment from "moment-timezone";
import CalendarMonthlyData from "../components/CalendarMonthlyData";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import OnDate from "../components/OnDate";
import { format } from 'date-fns';
import { appFetch } from "@/utils/appFetch";
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

export default function Calendar() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentIndiaDate = getCurrentIndiaDate();
  const [calendarDate, setCalendarDate] = useState(currentIndiaDate);
  const [loadingInitialToday, setLoadingInitialToday] = useState(true);
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
  const [canGoBackToDate, setCanGoBackToDate] = useState(false);

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
    setShowPopup(false);
    const previousMonth = new Date(calendarDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCalendarDate(new Date(previousMonth));
  }

  function getNextMonth() {
    setShowPopup(false);
    const nextMonth = new Date(calendarDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarDate(new Date(nextMonth));
  }

  function resetToCurrentMonth() {
    setShowPopup(false);
    setCanGoBackToDate(false);
    setCalendarDate(currentIndiaDate);
  }

  const url = `/api/calendar/${month + 1}/${year}`;
  const { data: calendarData, error, isLoading, mutate } = useSWR(url);

  useEffect(() => {
    // Only check version if data is present at the moment month/year changes
    // Since PWA is NetworkFirst, freshly fetched data is already the latest.
    if (calendarData?._version) {
      const checkCalendarVersion = async () => {
        const currentVersion = JSON.stringify(calendarData._version);
        try {
          const res = await appFetch(`/api/auth/versionCheck/calendar?month=${month + 1}&year=${year}&version=${encodeURIComponent(currentVersion)}`);
          if (res.ok) {
            const result = await res.json();
            if (result.mismatch) {
              console.log(`[VersionCheck] Stale data detected for calendar. Updating...`);
              const { clearPWACaches } = await import("@/utils/pwaCache");
              await clearPWACaches();
              await mutate(result.data, false);
            }
          }
        } catch (err) {
          console.error("[Calendar] Version check failed:", err);
        }
      };
      checkCalendarVersion();
    }
  }, [month, year, mutate]);




  const eventDatesValue = useMemo(() => calendarData?.eventDates || {}, [calendarData]);
  const datesList = useMemo(() => calendarData?.datesList || [], [calendarData]);

  useEffect(() => {
    if (calendarData && loadingInitialToday) {
      const todayEvents = calendarData.eventDates?.todayEvents || [];
      // Only show popup for today's events if we are looking at the current month/year
      if (todayEvents.length > 0 && month === currentMonth && year === currentYear) {
        const todayDateObj = new Date();
        setSelectedDate(todayDateObj.toISOString());
        setEventForDate(todayEvents);
        setShowPopupFor('date');
        setShowPopup(true);
      }
      setLoadingInitialToday(false);
    }
  }, [calendarData, loadingInitialToday, month, year, currentMonth, currentYear]);

  const HandlePopupData = (event: 'member' | 'date', data: any) => {
    if (event === 'member') {
      setSelectedMemberId(data);
      if (showPopupFor === 'date') {
        setCanGoBackToDate(true);
      } else {
        setCanGoBackToDate(false);
      }
      setShowPopupFor('member');
      setShowPopup(true);
    }
    if (event === 'date' && datesList?.includes(data)) {
      showEventForDate(data);
      setShowPopupFor('date');
      setCanGoBackToDate(false);
      setShowPopup(true);
    }
    return
  }

  return (
    <div className="w-full">
      <Topnav>
        {(isFuture || isPast) && (
          <div className="ml-auto mr-0 border border-border_color rounded-md p-1 flex items-center">
            {isFuture ? (
              <div className="cursor-pointer hover:bg-field_color transition-colors" onClick={resetToCurrentMonth} title="Jump to Current Month">
                <SkipBack />
              </div>
            ) : (
              <div className="cursor-pointer hover:bg-field_color transition-colors" onClick={resetToCurrentMonth} title="Jump to Current Month">
                <SkipForward />
              </div>
            )}
          </div>
        )}
      </Topnav>

      <div className="md:flex">
        <Container className='px-3 xl:pl-6 xl:pr-5 md:border-r md:border-border_color pb-3 w-full scroll-stable'>
          <div className="w-full max-w-3xl mx-auto mt-6">
            <div className="bg-field_color border border-border_color rounded-t-md text-text_color">
              <div className="flex items-center justify-between">
                <div className="font-light py-2 px-3 cursor-pointer" onClick={getPreviousMonth}>{"<"}</div>
                <div className="flex items-baseline">
                  <p className="font-medium text-xl pr-2">
                    {moment(calendarDate).tz("Asia/Kolkata").format("MMMM")}
                  </p>
                  <p className="font-medium text-base">
                    {moment(calendarDate).tz("Asia/Kolkata").format("YYYY")}
                  </p>
                </div>

                <div className="font-light py-2 px-3 cursor-pointer" onClick={getNextMonth}>{">"}</div>
              </div>
            </div>
            <div className="grid grid-cols-7 cursor-default text-text_color bg-field_color border-l border-border_color text-sm">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-1 md:font-medium text-center border-r border-b border-border_color">{day}</div>
              ))}

              {/* Render Empty Cells Before 1st of Month */}
              {Array.from({ length: firstDayOfMonth }, (_, index) => (
                <div key={index} className="h-12 border-r border-b border-border_color">
                  <p className="bg-main_background opacity-25 h-full">&nbsp;</p>
                </div>
              ))}

              {/* Render Days of Month with Events */}
              {Array.from({ length: lastDayOfMonth.getDate() }, (_, index) => {
                const date = index + 1;
                const cellDate = new Date(year, month, date);
                const cellIsToday = isToday(cellDate);

                return (
                  <div
                    key={date}
                    onClick={() => HandlePopupData('date', date)}
                    style={{ viewTransitionName: `item${date}` }}
                    className={`date-cell ${cellIsToday ? "bg-accent_color text-accent_contrast" : ""
                      } ${datesList?.includes(date) && 'cursor-pointer'} h-12 border-r flex flex-col justify-center items-center border-b border-border_color relative`}
                  >
                    {datesList?.includes(date) && !isLoading && <p className={`${cellIsToday ? "text-accent_contrast" : "text-accent_color"} mt-4 text-xl font-extrabold`}>.</p>}
                    <p className={`absolute p-0.5`}>{date}</p>
                  </div>
                );
              })}

              {/* Render Empty Cells After Last Day of Month */}
              {Array.from({ length: emptyCellsCount }, (_, index) => (
                <div key={index} className="h-12 border-r border-b border-border_color">
                  <p className="bg-main_background opacity-25 h-full">&nbsp;</p>
                </div>
              ))}
            </div>

            <div onClick={() => { setShowPopup(false); setCanGoBackToDate(false); }} className={`fixed md:hidden ${showPopup ? 'top-0 bg-gray-500/60' : 'bottom-full delay-[600ms] bg-gray-300/5'} inset-0 z-[100] transition-all duration-500 ease-in-out`} />
            <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background md:mt-8 ${showPopup ? 'z-[100] max-h-[80vh] md:max-h-none rounded-t-lg md:border border-border_color overflow-y-auto -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 invisible overflow-hidden md:h-0'} transition-all duration-500 ease-in-out md:transition-none md:duration-0 w-full mx-auto overflow-y-auto`}>
              <div className="relative">
                <span onClick={() => { setShowPopup(false); setCanGoBackToDate(false); }} className="absolute top-4 right-4 hidden md:block border border-border_color rounded-md cursor-pointer z-20"><CloseIcon /></span>
                {showPopupFor === 'date' && (() => {
                  const selected = new Date(selectedDate);
                  const selectedIsToday = isToday(selected);

                  return (
                    <div className={`border-b sticky top-0  ${showPopup ? 'visible delay-500 md:delay-0 transition-all md:transition-none' : 'invisible'} bg-main_background flex justify-between items-center border-border_color px-4 pt-3 pb-2`}>
                      <p className="flex flex-wrap text-lg md:text-xl font-medium md:font-semibold text-text_color items-end min-h-[1.875rem]">
                        {selectedIsToday &&
                          <>
                            <Announcement />
                            <span className="px-1 font-semibold text-accent_color">Today - </span>
                          </>
                        }
                        {format(selected, 'd MMM yyyy')}
                        <span className="font-normal pl-2">
                          ({format(selected, 'EEEE')})
                        </span>
                      </p>
                    </div>
                  );
                })()}
                {showPopupFor === 'member' && canGoBackToDate && (
                  <div className="border-b z-20 bg-main_background flex justify-between items-center border-border_color px-4 pt-3 pb-2">
                    <button
                      onClick={() => { setShowPopupFor('date'); setCanGoBackToDate(false); }}
                      className="text-accent_color font-medium flex items-center gap-1 hover:underline"
                    >
                      <span>{"←"}</span> Back to Date
                    </button>
                  </div>
                )}
                <div className={`${showPopup ? 'visible delay-500 md:delay-0 transition-all' : 'invisible opacity-0'}`}>
                  {showPopupFor === 'date' && <OnDate events={eventForDate} onMemberClick={(id) => HandlePopupData('member', id)} />}
                  {showPopupFor === 'member' && <CalendarMemberDetail memberId={selectedMemberId} />}
                </div>
              </div>
            </div>
          </div>
        </Container>
        <div className="w-full lg:max-w-[36.25rem] mx-auto">
          {isLoading ? <Loading /> :
            datesList?.length > 0
              ? <CalendarMonthlyData eventDatesValue={eventDatesValue} month={month} year={year} setSelectedMemberId={HandlePopupData} />
              : <p className="text-center pt-4 text-text_color">{!error ? 'No events in this month...' : 'Failed to load events for this month.'}</p>}
        </div>
      </div>
    </div>
  )
}