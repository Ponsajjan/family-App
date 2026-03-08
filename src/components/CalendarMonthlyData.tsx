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
      <div className="w-full mb-8">
        <div className="flex items-center gap-4 px-2 py-2 sticky top-0 md:top-0 z-10 bg-main_background/80 backdrop-blur-md">
          <span className="text-sm font-black uppercase tracking-[0.2em] text-accent_color">{title}</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-accent_color/20 to-transparent"></div>
        </div>
        <div className="flex flex-col gap-4 mt-4 px-2">
          {events.map((item, index) => {
            const date = new Date(item.date);
            const isBirthday = item.type === 'birthday';

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setSelectedMemberId('member', item.id ?? null)}
                className="group relative flex items-center glass-dark border border-border_color/20 rounded-2xl p-4 shadow-sm transition-all hover:scale-[1.02] hover:bg-white/5 active:scale-[0.98] cursor-pointer"
              >
                {/* Date Badge */}
                <div className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl glass border border-border_color/30 mr-5 group-hover:border-accent_color/30 transition-colors">
                  <span className="text-[0.65rem] font-bold text-accent_color uppercase tracking-tighter">
                    {format(new Date(year, month, date.getDate()), 'EEE')}
                  </span>
                  <span className="text-xl font-black text-text_color leading-none">
                    {date.getDate()}
                  </span>
                </div>

                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-lg font-bold tracking-tight text-text_color leading-tight group-hover:text-accent_color transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[0.7rem] font-bold text-text_color/40 uppercase tracking-widest flex items-center gap-1.5">
                      <span>{isBirthday ? 'Born' : 'Died'}</span>
                      <span className="w-1 h-1 rounded-full bg-text_color/20" />
                      <span className="text-text_color/60">
                        {date.getFullYear() === 1600
                          ? format(date, 'd MMM')
                          : !item.hasDate
                            ? format(date, 'MMM yyyy')
                            : format(date, 'd MMM yyyy')}
                      </span>
                    </div>
                  </div>

                  {item.age !== 'n/a' && (
                    <div className="flex flex-col items-center justify-center pl-5 border-l border-border_color/10 min-w-14">
                      <span className="text-[0.6rem] font-black text-text_color/20 uppercase tracking-[0.2em] leading-none mb-1">Age</span>
                      <span className="text-xl font-black text-accent_color leading-none">
                        {item.age}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 w-2 h-2 rounded-full m-2 ${isBirthday ? 'bg-indigo-500 shadow-[0_0_8px_indigo]' : 'bg-rose-500 shadow-[0_0_8px_rose]'}`} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Container className="custom-scrollbar pr-2">
      <div className="space-y-2">
        {renderEventList(todayEvents, "Today")}
        {renderEventList(tomorrowEvents, "Tomorrow")}
        {renderEventList(thisWeekEvents, "Later This Week")}
        {renderEventList(upcomingEvents, "Later This Month")}
        {renderEventList(pastEvents, "Earlier This Month")}
        {renderEventList(selectedMonthEvents, format(new Date(year, month), 'MMMM yyyy'))}
      </div>
    </Container>
  );
}
