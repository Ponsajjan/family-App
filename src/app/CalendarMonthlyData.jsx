import Container from "@/components/Container";
import { Birthday2, Deathday2 } from "@/utils/Icons";
import { format, differenceInYears } from 'date-fns';

export default function CalendarMonthlyData({data, month, year}) {
  const today = new Date();
  const todayDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const viewingMonth = format(new Date(year, month), 'MMMM');

  const pastEvents = [];
  const todayEvents = [];
  const thisWeekEvents = [];
  const upcomingEvents = [];
  const monthdat = [];

  if (currentMonth === month && currentYear === year) {
    data?.forEach(user => {
      const categorizeEvent = (date, type) => {
        if (date?.getMonth() === month && date?.getYear() != 1111) {
          const eventDay = date.getDate();
            if (eventDay < todayDate) {
              pastEvents.push({ ...user, type, date, age: differenceInYears(today, date) });
            } else if (eventDay === todayDate) {
              todayEvents.push({ ...user, type, date, age: differenceInYears(today, date) });
            } else if (eventDay > todayDate && eventDay <= todayDate + 7) {
              thisWeekEvents.push({ ...user, type, date, age: differenceInYears(today, date) });
            } else if (eventDay > todayDate + 7) {
              upcomingEvents.push({ ...user, type, date, age: differenceInYears(today, date) });
            }
          } else if (date?.getMonth() === month && date?.getYear() == 1111) {
          const eventDay = date.getDate();
            if (eventDay < todayDate) {
              pastEvents.push({ ...user, type, date, age: null });
            } else if (eventDay === todayDate) {
              todayEvents.push({ ...user, type, date, age: null });
            } else if (eventDay > todayDate && eventDay <= todayDate + 7) {
              thisWeekEvents.push({ ...user, type, date, age: null });
            } else if (eventDay > todayDate + 7) {
              upcomingEvents.push({ ...user, type, date, age: null });
            }
          }
        };
  
      // Check birthdays and deathdays
      if (user.birthday) categorizeEvent(new Date(user.birthday), 'birthday');
      if (user.deathday) categorizeEvent(new Date(user.deathday), 'deathday');
    });
  } else {
    data?.forEach(user => {
      const selectedMonth = (date, type) => {
        monthdat.push({ ...user, type, date, age: differenceInYears(new Date(year, month), date) });
      };
  
      // Check birthdays and deathdays
      if (user.birthday) selectedMonth(new Date(user.birthday), 'birthday');
      if (user.deathday) selectedMonth(new Date(user.deathday), 'deathday');
    });
  }

  const renderEventList = (events, title) => {
    // Sort events by date in ascending order within the current month
    let sortedEvents
    
    if (events === "Earlier This Month") {
      sortedEvents = events.sort((a, b) => a.date.getDate() - b.date.getDate());
    } else {
      sortedEvents = events.sort((a, b) => b.date.getDate() - a.date.getDate());
    }
  
    return (
      sortedEvents.length > 0 && (
        <div>
          <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-0 z-10">
            <span className="font-medium pr-1 whitespace-nowrap">{title}</span>
            <span className="border-t border-border_color block w-full"></span>
          </div>
          {sortedEvents.map((item, index) => (
            <div key={index} className={`pl-6 ${title === "Earlier This Month" && 'opacity-50'}`}>
              <div className="border-l border-border_color pt-1 pb-2 pl-4 pr-3">
                <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[60px]'>
                  <div className="border-t border-dashed border-text_color w-14 ml-2 mr-3">
                    <div className="flex flex-col border border-text_color rounded-b-sm">          
                      <span className="text-[9px] font-semibold border-b bg-text_color border-text_color text-center text-field_color">
                        {format(item.date, 'EEE').toUpperCase()}
                      </span>
                      <span className="text-center font-semibold leading-5 py-0.5">{format(item.date, 'd')}</span>
                    </div>
                  </div>
                  <div className='w-full flex justify-between items-center'>
                    <div>
                      <div className='font-semibold capitalize'>{item.name}</div>
                      <div className='text-xs font-light capitalize flex items-baseline gap-2'>
                        <span>
                        {item.type === 'birthday' ? 'Born At:' : 'Died At:'} {format(item.date, 'd MMM yyyy')}</span>
                        {item.type === 'birthday' ? <Birthday2 /> : <Deathday2 />}
                      </div>
                    </div>
                    <p className="font-light border-l border-border_color w-10 text-center">{item.age}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>)
      );
    };
  

  return (
    <Container>
      <div className="hidden md:block pt-3 sticky top-0 bg-main_background z-10"></div>
      {renderEventList(todayEvents, "Today")}
      {renderEventList(thisWeekEvents, "This Week")}
      {renderEventList(upcomingEvents, "Coming Up This Month")}
      {renderEventList(pastEvents, "Earlier This Month")}
      {renderEventList(monthdat, viewingMonth)}
    </Container>
  );
}
