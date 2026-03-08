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
        <div className="flex flex-col gap-3">
            {events.map((item, index) => {
                const isBirthday = item.type === 'birthday';
                return (
                    <div
                        key={index}
                        className="flex items-center glass-dark text-text_color border border-border_color/20 rounded-2xl p-4 shadow-md transition-all hover:scale-[1.02] hover:bg-white/5 active:scale-[0.98]"
                    >
                        <div className={`p-3 rounded-xl mr-4 ${isBirthday ? 'bg-indigo-500/10 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]'}`}>
                            {isBirthday ? <Birthday /> : <Deathday />}
                        </div>
                        <div className="w-full flex justify-between items-center">
                            <div className="flex flex-col gap-0.5">
                                <div className="text-lg font-bold tracking-tight leading-tight">{item.name}</div>
                                <div className="text-[0.7rem] font-bold text-text_color/40 uppercase tracking-widest flex items-center gap-1.5">
                                    <span>{isBirthday ? 'Born At' : 'Died At'}</span>
                                    <span className="w-1 h-1 rounded-full bg-text_color/20" />
                                    <span className="text-text_color/60">
                                        {item.hasDate ?
                                            new Date(item.date).getFullYear() === 1600
                                                ? format(item.date, 'd MMM')
                                                : format(item.date, 'd MMM yyyy') :
                                            new Date(item.date).getFullYear() === 1600
                                                ? format(item.date, '-- MMM')
                                                : format(item.date, '-- MM yyyy')
                                        }
                                    </span>
                                </div>
                            </div>
                            {item.age !== 'n/a' && (
                                <div className="flex flex-col items-center justify-center pl-5 border-l border-border_color/10 min-w-16">
                                    <span className="text-[0.65rem] font-black text-text_color/30 uppercase tracking-[0.2em] leading-none mb-1">Age</span>
                                    <span className="text-2xl font-black text-accent_color leading-none">
                                        {item.age}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default OnDate;
