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

function OnDate({ events, onMemberClick }: { events: CalendarMonthlyEvent[], onMemberClick?: (id: string) => void }) {

    return (
        <ul className='pt-4 pb-2 px-4 list-none' aria-label="Events on this date">
            {events.map((item, index) => {
                const eventTypeLabel = item.type === 'birthday' ? 'Birthday' : 'Death anniversary';
                return (
                    <li
                        key={index}
                        role={onMemberClick ? "button" : undefined}
                        tabIndex={onMemberClick ? 0 : undefined}
                        onClick={() => onMemberClick?.(item.id)}
                        onKeyDown={onMemberClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onMemberClick(item.id); } } : undefined}
                        aria-label={onMemberClick ? `View ${item.name} – ${eventTypeLabel}` : undefined}
                        className={`flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[3.75rem] mb-2 ${onMemberClick ? 'cursor-pointer' : ''}`}
                    >
                        <span className="p-2" aria-hidden="true">
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
                                <p className="font-light border-l border-dashed border-border_color min-w-10 text-center text-sm px-0.5" aria-label={`Age: ${item.age}`}>
                                    {item.age}
                                </p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default OnDate;
