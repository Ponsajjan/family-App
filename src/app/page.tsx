"use client";

import Topnav from "@/components/Topnav";
import { AllDates } from "@/utils/Icons";
import React, { Suspense, useEffect, useState } from "react";
import moment from "moment";
import { Circle } from "@/utils/Icons";
import CalendarMonthlyData from "./CalendarMonthlyData";
import Container from "@/components/Container";
import Loading from "@/components/Loading";

export default function Home() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [eventDates, setEventDates] = useState([]);
  const [dateList, setDateList] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const current_date = parseInt(moment().format("D"), 10);
  const current_month = parseInt(moment().format("M"), 10);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();


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
  const emptyCellsCount = 7 - lastDayOfMonth.getDay();

  // Handlers for previous/next month navigation
  function getPreviousMonth() {
    setLoading(true)
    const previousMonth = new Date(calendarDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCalendarDate(previousMonth);
  }

  function getNextMonth() {
    setLoading(true)
    const nextMonth = new Date(calendarDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarDate(nextMonth);
  }

  useEffect(() => {
    async function fetchEventDates() {
      try {
        const response = await fetch('api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ year, month }),
        });
        const { eventDates } = await response.json();
        setEventDates(eventDates);
  
        // Process data to create a list of event dates (day only)
        const DatesList = eventDates.flatMap((user: any) => {
          const events = [];
          if (user.birthday) {
            events.push(new Date(user.birthday).getDate());
          }
          if (user.deathday) {
            events.push(new Date(user.deathday).getDate());
          }
  
          return events;
        });

        setDateList(DatesList)
  
      } catch (error) {
        console.error("Failed to fetch event dates:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEventDates();
  }, [year, month]);

  return (
    <div className="w-full">
      <Topnav>
        <div className="ml-auto"><AllDates /></div>
      </Topnav>
      <div className="md:flex">
        <Container className='px-3 md:border-r md:border-border_color pb-3 w-full max-w-5xl'>
          <div className="w-full lg:max-w-xl mx-auto">
            <div className="bg-field_color border border-border_color rounded-t-md text-text_color mt-6 md:mt-3">
              <div className="flex items-center justify-between">
                <div className="font-light py-2 px-3 cursor-pointer" onClick={getPreviousMonth}>{"<"}</div>
                
                <div className="flex items-end">
                  <p className="font-medium text-xl pr-2">{moment(calendarDate).format("MMMM")}</p>
                  <p className="font-medium text-base">{moment(calendarDate).format("YYYY")}</p>
                </div>
                
                <div className="font-light py-2 px-3 cursor-pointer" onClick={getNextMonth}>{">"}</div>
              </div>
            </div>
            <div className="grid grid-cols-7 text-text_color bg-field_color border-l border-border_color text-sm">
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
                    style={{ viewTransitionName: `item${date}` }}
                    className={`date-cell ${
                      current_date == date && current_month == month + 1 ? "bg-accent_color text-accent_contrast" : ""
                    } h-12 border-r flex flex-col justify-center items-center border-b border-border_color relative`}
                  >
                        {dateList?.includes(date) && !loading && <p className={`${current_month == month + 1 && current_date == date ? "invert" : ""}`}>
                          <Circle />
                        </p>}
                        <p className={`absolute p-0.5`}>
                          {date}
                        </p>
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
          </div>
        </Container>
          <div className="w-full lg:max-w-lg mx-auto">
            {/* <Suspense fallback={<p className="text-center pt-4">Loading calendar details...</ p>}> */}
              {loading ? 
              <Loading /> :
              eventDates.length > 0 ?
              <CalendarMonthlyData data={eventDates} month={month} year={year} /> :
              <p className="text-center pt-4 text-text_color">No events in this month...</p>}
            {/* </Suspense> */}
          </div>
      </div>
    </div>
  )
}