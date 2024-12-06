import { Birthday, Deathday } from '@/utils/Icons';
import { format, differenceInYears } from 'date-fns';

interface Event {
    name: string;
    birthday?: string;
    deathday?: string;
}

interface CategorizedEvent extends Event {
    type: 'birthday' | 'deathday';
    date: Date;
    age: number | 'n/a';
}

function OnDate({ events, selectedDate }: { events: Event[], selectedDate: any }) {
    
    const dateEventList: CategorizedEvent[] = events?.flatMap((user) => {
        const result: CategorizedEvent[] = [];
        const addEvent = (date: Date, type: 'birthday' | 'deathday') => {
            const year = date.getFullYear();
            result.push({
                ...user,
                type,
                date,
                age: year === 1900 ? 'n/a' : differenceInYears(selectedDate, date),
            });
        };
        if (user.birthday) addEvent(new Date(user.birthday), 'birthday');
        if (user.deathday) addEvent(new Date(user.deathday), 'deathday');
        return result;
    }) || [];

    return (
        <>
            {dateEventList.map((item, index) => (
                <div
                    key={`${item.type}-${item.date.toISOString()}-${index}`}
                    className="flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[60px] mb-2"
                >
                    <span className="p-2">
                        {item.type === 'birthday' ? <Birthday /> : <Deathday />}
                    </span>
                    <div className="w-full flex justify-between items-center">
                        <div>
                            <div className="font-semibold capitalize">{item.name}</div>
                            <div className="text-xs font-light capitalize flex items-baseline gap-2">
                                <span>
                                    {item.type === 'birthday' ? 'Born At:' : 'Died At:'}{' '}
                                    {item.date.getFullYear() === 1900
                                        ? format(item.date, 'd MMM')
                                        : format(item.date, 'd MMM yyyy')}
                                </span>
                            </div>
                        </div>
                        {item.age !== 'n/a' && item.date.getFullYear() !== parseInt(format(selectedDate, 'yyyy')) && (
                            <p className="font-light border-l border-border_color w-10 text-center text-sm">
                                {item.age}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

export default OnDate;
