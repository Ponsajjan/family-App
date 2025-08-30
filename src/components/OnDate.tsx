import { Birthday, Deathday } from '@/utils/Icons';
import { format } from 'date-fns';

interface CalendarMonthlyEvent {
  id: string;
  name: string;
  date: Date;
  type: 'birthday' | 'deathday';
  hasDate: boolean;
  age: number | string;
}

function OnDate({ events }: { events: CalendarMonthlyEvent[] }) {

    return (
        <>
            {events.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[60px] mb-2"
                    >
                        <span className="p-2">
                            {item.type === 'birthday' ? <Birthday /> : <Deathday />}
                        </span>
                        <div className="w-full flex justify-between items-center">
                            <div>
                                <div className="font-medium md:font-semibold">{item.name}</div>
                                <div className="text-xs font-light capitalize">
                                    {item.type === 'birthday' ? 'Born At:' : 'Died At:'}{' '}
                                    {item.hasDate ?
                                    new Date(item.date).getFullYear() === 1600
                                        ? format(item.date, 'd MMM')
                                        : format(item.date, 'd MMM yyyy') :
                                    new Date(item.date).getFullYear() === 1600
                                        ? format(item.date, '-- MMM')
                                        : format(item.date, '-- MM yyyy')
                                    }
                                </div>
                            </div>
                            {item.age !== 'n/a' && (
                                <p className="font-light border-l border-dashed border-border_color min-w-10 text-center text-sm px-0.5">
                                    {item.age}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default OnDate;