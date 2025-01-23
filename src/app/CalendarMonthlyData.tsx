import Container from "@/components/Container";
import { Birthday2, Deathday, Deathday2 } from "@/utils/Icons";
import { format } from 'date-fns';

interface CalendarMonthlyDataProps {
  data: any;
  month: number;
  year: number;
}

interface CalendarMonthlyEvent {
  name: string;
  type: string;
  date: Date;
  age: number | string;
  hasDate?: boolean;
}

export default function CalendarMonthlyData(props: CalendarMonthlyDataProps) {
  const {data, month, year} = props;
  
  const today = new Date();
  const todayDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const pastEvents: CalendarMonthlyEvent[] = [];
  const todayEvents: CalendarMonthlyEvent[] = [];
  const tomorrowEvents: CalendarMonthlyEvent[] = [];
  const thisWeekEvents: CalendarMonthlyEvent[] = [];
  const upcomingEvents: CalendarMonthlyEvent[] = [];
  
  const selectedMonthData: CalendarMonthlyEvent[] = [];

  if (currentMonth === month && currentYear === year) { //for current month in current year
    data?.forEach((member:any) => {
      const categorizeEvent = (date:any, type:any) => {
        if (date && date.getMonth() === month) {
            console.log('data', new Date(year, month), today, date)
          const eventDay = date.getDate();   
          // Calculate the current week's start (Monday) and end (Sunday)
          const currentDayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
          const weekStartDate = todayDate - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1); // Adjust to Monday
          const weekEndDate = weekStartDate + 6; // Sunday of the same week
      
          if (eventDay < todayDate) {
            pastEvents.push({ ...member, type, date, age: date.getFullYear() == 1900 ? 'n/a' : (today.getFullYear() - date.getFullYear()) });
          } else if (eventDay === todayDate) {
            todayEvents.push({ ...member, type, date, age: date.getFullYear() == 1900 ? 'n/a' : (today.getFullYear() - date.getFullYear()) });
          } else if (eventDay === todayDate + 1) {
            tomorrowEvents.push({ ...member, type, date, age: date.getFullYear() == 1900 ? 'n/a' : (today.getFullYear() - date.getFullYear()) });
          } else if (eventDay > todayDate && eventDay <= weekEndDate) {
            thisWeekEvents.push({ ...member, type, date, age: date.getFullYear() == 1900 ? 'n/a' : (today.getFullYear() - date.getFullYear()) });
          } else {
            upcomingEvents.push({ ...member, type, date, age: date.getFullYear() == 1900 ? 'n/a' : (today.getFullYear() - date.getFullYear()) });
          }
        }
      };

      if (member.birthday) categorizeEvent(new Date(member.birthday), 'birthday');
      if (member.deathday) categorizeEvent(new Date(member.deathday), 'deathday');
    });
  } else { //for other months
    data?.forEach((member:any) => {
      const selectedMonth = (date:any, type:any) => {
        selectedMonthData.push({ ...member, type, date, age: date.getFullYear() == 1900 ? 'n/a' : (new Date(year, month).getFullYear() - date.getFullYear()) });
      };

      if (member.birthday) selectedMonth(new Date(member.birthday), 'birthday');
      if (member.deathday) selectedMonth(new Date(member.deathday), 'deathday');
    });
  }

  const renderEventList = (events:any, title:any) => {

    let sortedEvents
    
    if (title === "Earlier This Month") {
      sortedEvents = events.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => b.date.getDate() - a.date.getDate());
    } else {
      sortedEvents = events.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => a.date.getDate() - b.date.getDate());
    }
  
    return (
      sortedEvents.length > 0 && (
      <div>
        <div className="flex text-text_color items-center px-3 py-1 bg-main_background sticky top-12 md:top-0 z-10">
          <span className="font-medium pr-1 whitespace-nowrap">{title}</span>
          <span className="border-t border-border_color block w-full"></span>
        </div>
        <div className="pl-5 md:pl-4 pb-1">
          {sortedEvents.map((item:any, index:number) => (
            <div key={index} className="border-l border-border_color pt-2 pb-1 pl-4 pr-3">
              <div className={`flex items-center ${title === "Earlier This Month" && 'opacity-60'} bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[60px]`}>
                {item.hasDate ?
                <div className="border-t border-dashed border-text_color w-14 ml-2 mr-3">
                  <div className="flex flex-col border border-text_color rounded-b-sm">          
                    <span className="text-[9px] font-semibold border-b bg-text_color border-text_color text-center text-field_color">
                      {format(new Date(year, month, parseInt(format(item.date, 'd'))).toISOString(), 'EEE').toUpperCase()}
                    </span>
                    <span className="text-center font-semibold leading-5 py-0.5">{format(item.date, 'd')}</span>
                  </div>
                </div> :
                <div className="w-14 ml-2 mr-3">
                  <div className="flex justify-center items-center">          
                    <Deathday />
                  </div>
                </div>}
                <div className='w-full flex justify-between items-center'>
                  <div>
                    <div className='font-semibold capitalize leading-5'>{item.name}</div>
                    <div className='text-xs font-light capitalize flex items-baseline gap-2'>
                      <span className="leading-3">
                      {item.type === 'birthday' ? 'Born At: ' : 'Died At: '} 
                      {item.date.getFullYear() == 1900 
                      ? format(item.date, 'd MMM') 
                      : !item.hasDate 
                        ? format(item.date, 'MMM yyyy') 
                        : format(item.date, 'd MMM yyyy')}
                      </span>
                      {item.hasDate ? item.type === 'birthday' ? <Birthday2 /> : <Deathday2 /> : ''}
                    </div>
                  </div>
                  {(item.age === 'n/a' ||  item.date.getFullYear() === currentYear) ? "" : <p className="font-light border-l border-border_color w-10 text-center text-sm">{item.age}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )
    );
  };
  

  
  return (
    <Container className='scroll-stable'>
      <div className="hidden md:block pt-3 sticky top-0 bg-main_background z-10"></div>
      {renderEventList(todayEvents, "Today")}
      {renderEventList(tomorrowEvents, "Tomorrow")}
      {renderEventList(thisWeekEvents, "Later This Week")}
      {renderEventList(upcomingEvents, "Later This Month")}
      {renderEventList(pastEvents, "Earlier This Month")}
      {renderEventList(selectedMonthData, `${format(new Date(year, month), 'MMMM yyyy')}`)}
    </Container>
  );
}
