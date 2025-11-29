"use client";

import Topnav from "@/components/Topnav";
import { Announcement, CloseIcon } from "@/utils/Icons";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone"; // Changed from moment to moment-timezone
import CalendarMonthlyData from "../components/CalendarMonthlyData";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import OnDate from "../components/OnDate";
import { format } from 'date-fns';
import { useToast } from '@/components/Toast';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CalendarMemberDetail from "../components/CalendarMemberDetail";

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

  const [selectedDate, setSelectedDate] = useState('');
  const [eventForDate, setEventForDate] = useState<CalendarMonthlyEvent[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showPopupFor, setShowPopupFor] = useState<'member' | 'date' | null>(null);
  const { logout, isAuthenticated, access } = useAuth();

  // Function to send push notification
  // const sendNotification = (events: CalendarMonthlyEvent[]) => {
  //   if ('Notification' in window) {
  //     const sendNotifications = (permission: NotificationPermission) => {
  //       if (permission === 'granted') {
  //         events.forEach(event => {
  //           const eventName = `${event.name} (${(event.type === 'birthday' ? '\u{1F382} Birthday' : 'Remembrance \u{1F490}')})`;
  //           new Notification('Family Calendar Reminder', {
  //             body: `Today: ${eventName}`,
  //             icon: '/web-app-manifest-192x192.png',
  //             badge: '/web-app-manifest-192x192.png'
  //           });
  //         });
  //       }
  //     };

  //     if (Notification.permission === 'granted') {
  //       sendNotifications('granted');
  //     } else if (Notification.permission !== 'denied') {
  //       Notification.requestPermission().then(sendNotifications);
  //     }
  //   }
  // };

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return
    }
    if (access == 'Admin') {
      router.push('/admin');
      return;
    }
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
          // Function to send push notification
          // const today = new Date().toDateString();
          // const lastNotificationDate = localStorage.getItem('lastNotificationDate');
          // if (lastNotificationDate !== today) {
          //   sendNotification(todayEvents);
          //   localStorage.setItem('lastNotificationDate', today);
          // }

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
  }, [isAuthenticated, month, year, toast, logout, access, router]);

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
    <div className="w-full">
      <Topnav>
      </Topnav>

      <div className="md:flex">
        <Container className='px-3 md:border-r md:border-border_color pb-3 w-full'>
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
                    {datesList?.includes(date) && !loading && <p className={`${cellIsToday ? "text-accent_contrast" : "text-accent_color"} mt-4 text-xl font-extrabold`}>.</p>}
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

            <div onClick={() => setShowPopup(false)} className={`fixed md:hidden ${showPopup ? 'top-0 bg-gray-500/60' : 'bottom-full delay-[600ms] bg-gray-300/5'} inset-0 z-[100] transition-all duration-500 ease-in-out`} />
            <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background md:mt-8 ${showPopup ? 'z-[100] max-h-[80vh] md:max-h-none rounded-t-lg md:border border-border_color overflow-y-auto -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 invisible overflow-hidden'} transition-all duration-500 ease-in-out md:transition-none md:duration-0 w-full mx-auto overflow-y-auto`}>
              <div className="relative">
                <span onClick={() => setShowPopup(false)} className="absolute top-4 right-4 hidden md:block border border-border_color rounded-md cursor-pointer z-10"><CloseIcon /></span>
                {showPopupFor === 'date' && (() => {
                  const selected = new Date(selectedDate);
                  const selectedIsToday = isToday(selected);

                  return (
                    <div className={`border-b sticky top-0  ${showPopup ? 'visible delay-500 md:delay-0 transition-all md:transition-none' : 'invisible'} bg-main_background flex justify-between items-center border-border_color px-4 pt-3 pb-2`}>
                      <p className="flex flex-wrap text-xl font-medium md:font-semibold text-text_color items-end min-h-[30px]">
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
                <div className={`p-4 ${showPopup ? 'visible delay-500 md:delay-0 transition-all' : 'invisible opacity-0'}`}>
                  {showPopupFor === 'date' && <OnDate events={eventForDate} />}
                  {showPopupFor === 'member' && <CalendarMemberDetail memberId={selectedMemberId} />}
                </div>
              </div>
            </div>
          </div>
        </Container>
        <div className="w-full lg:max-w-[580px] mx-auto">
          {loading ? <Loading /> :
            datesList?.length > 0
              ? <CalendarMonthlyData eventDatesValue={eventDatesValue} month={month} year={year} setSelectedMemberId={HandlePopupData} />
              : <p className="text-center pt-4 text-text_color">No events in this month...</p>}
        </div>
      </div>
    </div>
  )
}