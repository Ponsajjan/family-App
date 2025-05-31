"use client";

import Topnav from "@/components/Topnav";
import { CloseIcon } from "@/utils/Icons";
import React, { Suspense, useEffect, useState } from "react";
import moment from "moment";
import CalendarMonthlyData from "./CalendarMonthlyData";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import OnDate from "./OnDate";
import { format } from 'date-fns';
import { useToast } from '@/components/Toast';
import { getCookie } from 'cookies-next';
import { useRouter } from "next/navigation";

export default function Home() {
  const toast = useToast();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [eventDates, setEventDates] = useState([]);
  const [dateList, setDateList] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);

  const current_date = parseInt(moment().format("D"), 10);
  const current_month = parseInt(moment().format("M"), 10);
  const current_year = parseInt(moment().format("YYYY"), 10);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const [selectedDate, setSelectedDate] = useState('')
  const [eventForDate, setEventForDate] = useState([])
  const token = getCookie('token');
  const router = useRouter(); 

  // Helper functions for first/last day of the month
  function getFirstDayOfMonth(year:number, month:number) {
    const selectMonth = new Date(year, month, 1);
    return selectMonth.getDay() === 0 ? 6 : selectMonth.getDay() - 1;
  }

  function getLastDayOfMonth(year:number, month:number) {
    return new Date(year, month + 1, 0);
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
    if (!dateList?.includes(date)) {
      return
    }

    setSelectedDate(new Date(year, month, date).toISOString());

    const filtered = eventDates.filter((item: any) => {
      return Object.keys(item).some((key) => {
        if (key.endsWith("day")) {
          try {
            const itemDate = new Date(item[key]);
            return itemDate.getDate() === date;
          } catch (error) {
            return false; // Skip invalid date fields
          }
        }
        return false;
      });
    });
    setEventForDate(filtered);
 
    setShowPopup(true)
  }

  // Handlers for previous/next month navigation
  function getPreviousMonth() {
    setLoading(true)
    setShowPopup(false)
    const previousMonth = new Date(calendarDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCalendarDate(previousMonth);
  }

  function getNextMonth() {
    setLoading(true)
    setShowPopup(false)
    const nextMonth = new Date(calendarDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarDate(nextMonth);
  }

  useEffect(() => {
    async function fetchEventDates() {
      try {
        const response = await fetch(`/api/calendar/${month + 1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        // Handle 401 Unauthorized
        if (response.status === 401) {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.push('/login');
          return;
        }
        // Check if the response was successful
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const { eventDates = [] } = await response.json();
        setEventDates(eventDates);

        // Process data to create a list of event dates (day only)
        const datesList = eventDates.flatMap((member: any) => {
          const events = [];
          if (member.birthday) {
            events.push(new Date(member.birthday).getDate());
          }
          if (member.deathday && member.hasDate) {
            events.push(new Date(member.deathday).getDate());
          }
          return events;
        });

        setDateList(datesList);

      } catch (error: any) {
        toast?.show(error.error || "Failed to fetch event dates.", "error", 5000);
      } finally {
        setLoading(false);
      }
    }

    fetchEventDates();
  }, [month, toast, token, router]);

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
                
                <div className="flex items-end">
                  <p className="font-medium text-xl pr-2">{moment(calendarDate).format("MMMM")}</p>
                  <p className="font-medium text-base">{moment(calendarDate).format("YYYY")}</p>
                </div>
                
                <div className="font-light py-2 px-3 cursor-pointer" onClick={getNextMonth}>{">"}</div>
              </div>
            </div>
            <div className="grid grid-cols-7 cursor-default text-text_color bg-field_color border-l border-border_color text-sm">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-1 text-center border-r border-b border-border_color">{day}</div>
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
                
                return (
                  <div
                    key={date}
                    onClick={() => showEventForDate(date)}
                    style={{ viewTransitionName: `item${date}` }}
                    className={`date-cell ${
                      (current_date == date && current_month == month + 1 && current_year == year) ? "bg-accent_color text-accent_contrast" : ""
                    } ${dateList?.includes(date) && 'cursor-pointer'} h-12 border-r flex flex-col justify-center items-center border-b border-border_color relative`}
                  >
                    {dateList?.includes(date) && !loading && <p className={`${current_month == month + 1 && current_date == date ? "text-accent_contrast" : "text-accent_color"} mt-4 text-xl font-extrabold`}>.</p>}
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
            <div onClick={() => setShowPopup(false)} className={`fixed md:hidden ${showPopup ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] transition-all duration-500 ease-in-out`} />
            <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background md:mt-8 ${showPopup ? 'z-[100] max-h-[60vh] md:max-h-none rounded-t-lg md:border border-border_color overflow-y-auto -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 invisible overflow-hidden'} transition-all duration-500 ease-in-out md:transition-none md:duration-0 w-full mx-auto overflow-y-auto`}>
              <div className={`border-b sticky top-0  ${showPopup ? 'visible delay-500 md:delay-0 transition-all md:transition-none' : 'invisible'} bg-main_background flex justify-between items-center border-border_color p-4`}>
                {showPopup && <p className="text-xl font-semibold text-text_color">{format(selectedDate, 'd MMM yyyy')}<span className="font-normal pl-2">({format(new Date(selectedDate).toISOString(), 'EEEE')})</span></p>}
                <span onClick={() => setShowPopup(false)} className="hidden md:block border border-border_color rounded-md cursor-pointer"><CloseIcon /></span>
              </div>
              <div className={`p-4 h-auto ${showPopup ? 'visible delay-500 md:delay-0 transition-all' : 'invisible opacity-0'}`}>
                <OnDate events={eventForDate} selectedDate={selectedDate} />
              </div>
            </div>
          </div>


        </Container>
        <div className="w-full lg:max-w-[580px] mx-auto">
          {/* <Suspense fallback={<p className="text-center pt-4">Loading calendar details...</ p>}> */}
            {loading ? <Loading /> :
            eventDates?.length > 0 
            ? <CalendarMonthlyData data={eventDates} month={month} year={year} /> 
            : <p className="text-center pt-4 text-text_color">No events in this month...</p>}
          {/* </Suspense> */}
        </div>
      </div>
    </div>
  )
}