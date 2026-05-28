import Container from "@/components/Container";
import { Birthday2, Deathday, Deathday2 } from "@/utils/Icons";
import { format } from 'date-fns';

interface CalendarMonthlyEvent {
  id: string;
  name: string;
  date: Date;
  type: 'birthday' | 'deathday';
  hasDate: boolean;
  age: number | string;
}

interface CalendarMonthlyDataProps {
  eventDatesValue: {
    pastEvents: CalendarMonthlyEvent[];
    todayEvents: CalendarMonthlyEvent[];
    tomorrowEvents: CalendarMonthlyEvent[];
    thisWeekEvents: CalendarMonthlyEvent[];
    upcomingEvents: CalendarMonthlyEvent[];
    selectedMonthEvents: CalendarMonthlyEvent[];
    datesList: number[];
  }
  month: number;
  year: number;
  setSelectedMemberId: (event: "member" | "date", id: string | number) => void;
}

export default function CalendarMonthlyData({ eventDatesValue, month, year, setSelectedMemberId }: CalendarMonthlyDataProps) {
  // Destructure all values from eventDatesValue
  const {
    pastEvents = [],
    todayEvents = [],
    tomorrowEvents = [],
    thisWeekEvents = [],
    upcomingEvents = [],
    selectedMonthEvents = [],
  } = eventDatesValue;

  const renderEventList = (events: CalendarMonthlyEvent[], title: string) => {
    if (!events?.length) return null;

    return (
      <div className="w-full">
        <div className="flex text-text_color items-center px-3 py-1 bg-main_background sticky top-12 md:top-3 z-10 cursor-default">
          <span className="font-medium pr-2 whitespace-nowrap">{title}</span>
          <span className="border-t border-border_color block w-full"></span>
        </div>
        <div className="pl-5 md:pl-4 pb-1">
          {events.map((item, index) => {
            const date = new Date(item.date);
            const displayDate = new Date(year, month, date.getDate());

            return (
              <div key={`${item.id}-${index}`} className="border-l border-border_color pt-2 pb-1 pl-4 pr-3 cursor-pointer">
                <div onClick={() => setSelectedMemberId('member', item.id ?? null)} className="flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[3.75rem]">
                  {item.hasDate ? (
                    <div className={`border-t border-dashed ${title === "Earlier This Month" ? 'opacity-60' : ''} border-text_color w-14 ml-2 mr-3`}>
                      <div className="flex flex-col border border-text_color rounded-b-sm">
                        <span className="text-[0.5625rem] font-semibold border-b bg-text_color border-text_color text-center text-field_color">
                          {format(displayDate, 'EEE').toUpperCase()}
                        </span>
                        <span className="text-center font-semibold leading-5 py-0.5">{date.getDate()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 ml-2 mr-3">
                      <div className={`flex justify-center ${title === "Earlier This Month" ? 'opacity-60' : ''} items-center`}>
                        <Deathday />
                      </div>
                    </div>
                  )}
                  <div className='w-full flex justify-between items-center'>
                    <div>
                      <div className='font-medium md:font-semibold capitalize leading-5'>{item.name}</div>
                      <div className='text-xs font-light capitalize flex items-end gap-2'>
                        <span className="leading-3">
                          {item.type === 'birthday' ? 'Born At: ' : 'Died At: '}
                          {date.getFullYear() === 1600
                            ? format(date, 'd MMM')
                            : !item.hasDate
                              ? format(date, 'MMM yyyy')
                              : format(date, 'd MMM yyyy')}
                        </span>
                        {item.hasDate && (item.type === 'birthday' ? <Birthday2 /> : <Deathday2 />)}
                      </div>
                    </div>
                    {item.age !== 'n/a' && (
                      <p className="font-light border-l border-dashed border-border_color min-w-10 text-center text-sm px-0.5">
                        {item.age}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Container className='scroll-stable xl:px-2'>
      <div className="hidden md:block pt-3 sticky top-0 bg-main_background z-10"></div>
      {renderEventList(todayEvents, "Today")}
      {renderEventList(tomorrowEvents, "Tomorrow")}
      {renderEventList(thisWeekEvents, "Later This Week")}
      {renderEventList(upcomingEvents, "Later This Month")}
      {renderEventList(pastEvents, "Earlier This Month")}
      {renderEventList(selectedMonthEvents, `${format(new Date(year, month), 'MMMM yyyy')}`)}
    </Container>
  );
}