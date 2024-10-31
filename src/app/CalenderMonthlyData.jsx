import Container from "@/components/Container";
import prisma from "@/db/db";
import { Birthday2 } from "@/utils/Icons";

export default async function CalenderMonthlyData () {
  const data = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      birthday: true,
    },
    // take: 4,
    orderBy: { name: "asc" },
  });
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
    <Container>
      <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-3 z-10">
        <span className="font-medium pr-1 whitespace-nowrap">Today</span>
        <span className="border-t border-border_color block w-full"></span>
      </div>
      <div className="pl-6">
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]'>
            <div className="border-t border-dashed border-text_color w-12 mx-2">
              <div className="flex flex-col border border-text_color rounded-b-sm">          
                <span className="text-[9px] border-b bg-text_color border-text_color leading-3 text-center text-field_color">AUG</span>
                <span className="text-center leading-5">15</span>
              </div>
            </div>
            <div className='w-full flex justify-between items-center'>
              <div>
                <div className='font-semibold leading-3 capitalize'>Ponsajjan</div>
                <div className='text-xs font-light capitalize flex items-baseline gap-2'>
                  <span className="leading-3">Born At: 15 August 1995</span>
                  <Birthday2 />
                </div>
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
            <div className="border-t border-dashed border-text_color w-12 mx-2">
              <div className="flex flex-col border border-text_color rounded-b-sm">          
                <span className="text-[9px] border-b bg-text_color border-text_color leading-3 text-center text-field_color">AUG</span>
                <span className="text-center leading-5">15</span>
              </div>
            </div>
            <div className='w-full flex justify-between items-center'>
              <div>
                <div className='font-semibold leading-3 capitalize'>Ponsajjan</div>
                <div className='text-xs font-light capitalize flex items-baseline gap-2'>
                  <span className="leading-3">Born At: 15 August 1995</span>
                  <Birthday2 />
                </div>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">28</p>
            </div>
          </div>
        </div>
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]'>
            <div className="border-t border-dashed border-text_color w-12 mx-2">
              <div className="flex flex-col border border-text_color rounded-b-sm">          
                <span className="text-[9px] border-b bg-text_color border-text_color leading-3 text-center text-field_color">AUG</span>
                <span className="text-center leading-5">15</span>
              </div>
            </div>
            <div className='w-full flex justify-between items-center'>
              <div>
                <div className='font-semibold leading-3 capitalize'>Ponsajjan</div>
                <div className='text-xs font-light capitalize flex items-baseline gap-2'>
                  <span className="leading-3">Born At: 15 August 1995</span>
                  <Birthday2 />
                </div>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">28</p>
            </div>
          </div>
        </div>
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]'>
            <div className="border-t border-dashed border-text_color w-12 mx-2">
              <div className="flex flex-col border border-text_color rounded-b-sm">          
                <span className="text-[9px] border-b bg-text_color border-text_color leading-3 text-center text-field_color">AUG</span>
                <span className="text-center leading-5">15</span>
              </div>
            </div>
            <div className='w-full flex justify-between items-center'>
              <div>
                <div className='font-semibold leading-3 capitalize'>Ponsajjan</div>
                <div className='text-xs font-light capitalize flex items-baseline gap-2'>
                  <span className="leading-3">Born At: 15 August 1995</span>
                  <Birthday2 />
                </div>
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
      <div key={index} className="pl-6">
        <div className="border-l border-border_color py-1 pl-4 pr-3">
          <div className='flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[54px]' key={index}>
            <div className="border-t border-dashed border-text_color w-12 mx-2">
              <div className="flex flex-col border border-text_color rounded-b-sm">          
                <span className="text-[9px] border-b bg-text_color border-text_color leading-3 text-center text-field_color">AUG</span>
                <span className="text-center leading-5">15</span>
              </div>
            </div>
            <div className='w-full flex justify-between items-center'>
              <div>
                <div className='font-semibold leading-3 capitalize'>{item.name}</div>
                <div className='text-xs font-light capitalize flex items-baseline gap-2'>
                  <span className="leading-3">Born At: 15 August 1995</span>
                  <Birthday2 />
                </div>
              </div>
              <p className="font-light border-l border-border_color w-10 text-center">{item.age}</p>
            </div>
          </div>
        </div>
      </div>
      ))}
    </Container>
  )
}