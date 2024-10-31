"use client"

import React, { useState } from "react";
import moment from "moment";
import { Birthday, Deathday, Star } from "@/utils/Icons";
import Tooltip from "@/components/Tooltip";


function Calender() {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const [calenderDate, setCalenderDate] = useState(new Date());
    
    function getFirstDayOfMonth(year, month) {
        const selectMonth = new Date(year, month, 1)
        if (selectMonth.getDay() -1 >= 0) {
            const firstDay = selectMonth.getDay() -1
            return firstDay
        } else {
            const firstDay = 6
            return firstDay
        }
    }

    function getLastDayOfMonth(year, month) {
        const nextMonth = new Date(year, month + 1, 1);
        const lastDay = new Date(nextMonth - 1);
        return lastDay;
    }
    const current_date = moment(new Date()).format('D');
    const current_month = moment(new Date()).format('M');

    const year = calenderDate.getFullYear();
    const month = calenderDate.getMonth();
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    // ---------------------------------------------------
    const lastDayOfMonth = getLastDayOfMonth(year, month);
    // ---------------------------------------------------
    const emptyCells = 7 - lastDayOfMonth.getDay();
    
    let emptyCellsCount;
    
    if (emptyCells < 7) {
        emptyCellsCount = emptyCells;
    } else {
        emptyCellsCount = 0;
    }

    // function getPreviousMonth() {
    //     calenderDate.setDate(0);
    //     const previousMonth = new Date(calenderDate);
    //     setCalenderDate(previousMonth)
    //     return previousMonth;
    // }
      
    // function getNextMonth() {
    //     calenderDate.setMonth(calenderDate.getMonth() + 1, 1);
    //     const nextMonth = new Date(calenderDate)
    //     setCalenderDate(nextMonth)
    //     return nextMonth;
    // }

    function getPreviousMonth() {
        const previousMonthDate = new Date(calenderDate);
        previousMonthDate.setMonth(calenderDate.getMonth() - 1);
      
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            setCalenderDate(previousMonthDate); // Update the calendar date smoothly
          });
        } else {
          setCalenderDate(previousMonthDate); // Fallback for browsers that don't support view transitions
        }
      
        return previousMonthDate;
    }
      
    function getNextMonth() {
        const nextMonthDate = new Date(calenderDate);
        nextMonthDate.setMonth(calenderDate.getMonth() + 1);
      
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            setCalenderDate(nextMonthDate); // Update the calendar date smoothly
          });
        } else {
          setCalenderDate(nextMonthDate); // Fallback for browsers that don't support view transitions
        }
      
        return nextMonthDate;
    }

    return (
        <>
            <div className="bg-field_color border border-border_color rounded-t-md text-text_color mt-6 md:mt-3">
                <div className="flex items-center justify-between">
                    <div className="font-light py-2 px-3 cursor-pointer" onClick={getPreviousMonth}>{"<"}</div>
                    
                    <div className="flex items-end">
                        <p className="font-medium text-xl pr-2">{moment(calenderDate).format('MMMM')}</p>
                        <p className="font-medium text-base">{moment(calenderDate).format('YYYY')}</p>
                    </div>
                    
                    <div className="font-light py-2 px-3 cursor-pointer" onClick={getNextMonth}>{">"}</div>
                </div>
            </div>
            <div className='grid grid-cols-7 text-text_color bg-field_color border-l border-border_color text-sm'>
                {daysOfWeek.map((day) => (
                    <div key={day} className='py-1 text-center border-r border-b border-border_color'>{day}</div>
                ))}

                {Array.from({ length: firstDayOfMonth }, (_, index) => {
                    const date = index + 1;
                    return (
                        <div key={date} className='h-12 border-r border-b border-border_color'>
                            <p className="bg-main_background opacity-25 h-full">&nbsp;</p>
                        </div>
                    );
                })}

                {Array.from({ length: lastDayOfMonth.getDate() }, (_, index) => {
                    const date = index + 1;
                    return (
                        <div key={date} style={{viewTransitionName: `item${date}`}} className={`date-cell ${(current_date == date && current_month == (month +1)) && 'bg-accent_color text-accent_contrast'} h-12 border-r flex flex-col justify-center items-center border-b border-border_color relative`}>
                            {(date=== 1 || date=== 18 || date=== 12) ?
                            <>
                                <p className={`${(current_date == date && current_month == (month +1)) ? 'invert' : ''}`}><Star /></p>
                                <p className={`${(current_date == date && current_month == (month +1)) ? 'text-accent_contrast' : 'text-text_color'} absolute  p-0.5`}>{date}</p> 
                            </>:
                            <>
                                <p>{date}</p>
                            </>}
                        </div>
                    );
                })}

                {Array.from({ length: emptyCellsCount }, (_, index) => {
                    const date = index + 1;
                    return (
                        <div key={date} className='h-12 border-r border-b border-border_color'>
                            <p className="bg-main_background opacity-25 h-full">&nbsp;</p>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default Calender