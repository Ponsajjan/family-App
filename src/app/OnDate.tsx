import { Birthday, Deathday } from '@/utils/Icons';
import { format, differenceInYears } from 'date-fns';

interface Event {
    name: string;
    type: 'birthday' | 'deathday';
    date: Date;
}

interface CategorizedEvent extends Event {
    type: 'birthday' | 'deathday';
    date: Date;
    age: number | 'n/a';
}

// Helper function to convert any date to IST
const toIST = (date: Date | string) => {
    const d = new Date(date);
    return new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

function OnDate({ events, selectedDate }: { events: Event[], selectedDate: any }) {
    // Convert selectedDate to IST
    const istSelectedDate = toIST(new Date(selectedDate));
    
    const dateEventList: CategorizedEvent[] = events?.flatMap((member) => {
        const result: CategorizedEvent[] = [];
        const addEvent = (date: Date, type: 'birthday' | 'deathday') => {
            const istDate = toIST(date);
            const year = istDate.getFullYear();
            result.push({
                ...member,
                type,
                date: istDate,
                age: year === 1600 ? 'n/a' : differenceInYears(istSelectedDate, istDate),
            });
        };
        if (member.type == 'birthday') addEvent(new Date(member.date), 'birthday');
        if (member.type == 'deathday') addEvent(new Date(member.date), 'deathday');
        return result;
    }) || [];

    return (
        <>
            {dateEventList.map((item, index) => {
                const istDate = toIST(item.date);
                const currentYear = toIST(new Date()).getFullYear();
                
                return (
                    <div
                        key={`${item.type}-${istDate.toISOString()}-${index}`}
                        className="flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[60px] mb-2"
                    >
                        <span className="p-2">
                            {item.type === 'birthday' ? <Birthday /> : <Deathday />}
                        </span>
                        <div className="w-full flex justify-between items-center">
                            <div>
                                <div className="font-semibold capitalize">{item.name}</div>
                                <div className="text-xs font-light capitalize">
                                    {item.type === 'birthday' ? 'Born At:' : 'Died At:'}{' '}
                                    {istDate.getFullYear() === 1600
                                        ? format(istDate, 'd MMM')
                                        : format(istDate, 'd MMM yyyy')}
                                </div>
                            </div>
                            {item.age !== 'n/a' && istDate.getFullYear() !== currentYear && (
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