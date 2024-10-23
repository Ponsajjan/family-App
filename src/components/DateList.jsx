import { Birthday, Deathday, Female, Male } from "@/utils/Icons";

function DateList() {
    const birthday = [
        {
          name: 'Ponsajjan',
          type: 'birthday',
          date: '3',
          age: '29'
        },
        {
          name: 'Poan',
          type: 'birthday',
          date: '10',
          age: '18'
        },
        {
          name: 'Suresh',
          type: 'deathday',
          date: '15',
          age: '12'
        },
        {
          name: 'Naresh',
          type: 'birthday',
          date: '28',
          age: '33'
        },
        {
          name: 'Ponsajjan',
          type: 'birthday',
          date: '3',
          age: '28'
        },
        {
          name: 'Poan',
          type: 'birthday',
          date: '10',
          age: '27'
        },
        {
          name: 'Suresh',
          type: 'birthday',
          date: '15',
          age: '15'
        },
        {
          name: 'Naresh',
          type: 'birthday',
          date: '28',
          age: '27'
        },
        {
          name: 'Ponsajjan',
          type: 'birthday',
          date: '3',
          age: '40'
        },
        {
          name: 'Poan',
          type: 'birthday',
          date: '10',
          age: '58',
          aniversory: '(3)'
        },
        {
          name: 'Suresh',
          type: 'birthday',
          date: '15',
          age: '71'
        },
        {
          name: 'Naresh',
          type: 'birthday',
          date: '28',
          age: '101'
        }
      ];
  return (
    <div className="w-full">
      <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-3 z-10">
        <span className="font-medium pr-1 whitespace-nowrap">Today</span>
        <span className="border-t border-border_color block w-full"></span>
      </div>
      <div className="pl-6">
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]'>
            <div className="flex p-2">          
              {<Birthday />}
            </div>
            <div className='w-full flex justify-between items-center'>
              <div className="pl-2">
                <div className="flex flex-wrap gap-2">
                  <div className='font-semibold capitalize'>Ponsajjan</div>
                </div>
                <p className="text-xs font-light leading-3 opacity-65">15 August 1995</p>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">28</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-3 z-10">
        <span className="font-medium pr-1 whitespace-nowrap">This Week</span>
        <span className="border-t border-border_color block w-full"></span>
      </div>
      <div className="pl-6">
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]'>
            <div className="flex p-2">          
              {<Birthday />}
            </div>
            <div className='w-full flex justify-between items-center'>
              <div className="pl-2">
                <div className="flex flex-wrap gap-2">
                  <div className='font-semibold capitalize'>Ponsajjan</div>
                </div>
                <p className="text-xs font-light leading-3 opacity-65">15 August 1995</p>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">28</p>
            </div>
          </div>
        </div>
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]'>
            <div className="flex p-2">          
              {<Birthday />}
            </div>
            <div className='w-full flex justify-between items-center'>
              <div className="pl-2">
                <div className="flex flex-wrap gap-2">
                  <div className='font-semibold capitalize'>Ponsajjan</div>
                </div>
                <p className="text-xs font-light leading-3 opacity-65">15 August 1995</p>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">28</p>
            </div>
          </div>
        </div>
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]'>
            <div className="flex p-2">          
              {<Birthday />}
            </div>
            <div className='w-full flex justify-between items-center'>
              <div className="pl-2">
                <div className="flex flex-wrap gap-2">
                  <div className='font-semibold capitalize'>Ponsajjan</div>
                </div>
                <p className="text-xs font-light leading-3 opacity-65">15 August 1995</p>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">28</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-3 z-10">
        <span className="font-medium pr-1 whitespace-nowrap">This Month</span>
        <span className="border-t border-border_color block w-full"></span>
      </div>
      {birthday.map((item, index) => (
      <div className="pl-6">
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]' key={index}>
            <div className="flex p-2">          
              {item.type === 'birthday' && <Birthday />}
              {item.type === 'deathday' && <Deathday />}
            </div>
            <div className='w-full flex justify-between items-center'>
              <div className="pl-2">
                <div className="flex flex-wrap gap-2">
                  <div className='font-semibold capitalize'>{item.name}</div>
                </div>
                <p className="text-xs font-light leading-3 opacity-65">15 August 1995</p>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">{item.age}</p>
            </div>
          </div>
        </div>
      </div>
      ))}
    </div>
  )
}

export default DateList