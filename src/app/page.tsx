import Calender from "./Calender";
import CalenderMonthlyData from "./CalenderMonthlyData";
import prisma from "@/db/db";
import Topnav from "@/components/Topnav";
import Container from "@/components/Container";
import { AllDates } from "@/utils/Icons";

export default async function Home() {
  const month = 10; 
  // Step 1: Fetch data from Prisma
  const data = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      birthday: true,
      deathday: true,
    },
  });

  // Step 2: Filter for the specific month and map to only days
  const eventDates = data.flatMap((user) => {
    const events = [];
    
    // Check if birthday is in the specified month
    if (user.birthday && new Date(user.birthday).getMonth() === month) {
      events.push(new Date(user.birthday).getDate()); // Extract day only
    }
    
    // Check if deathday is in the specified month
    if (user.deathday && new Date(user.deathday).getMonth() === month) {
      events.push(new Date(user.deathday).getDate()); // Extract day only
    }

    return events;
  });

  return (
    <div className="w-full">
      <Topnav>
        <p>November 2024</p>
        <div className="ml-auto"><AllDates /></div>
      </Topnav>
      <div className="md:flex">
        <Container className='md:px-3 md:border-r md:border-border_color pb-3 w-full max-w-5xl'>
          <div className="w-full lg:max-w-xl mx-auto">
            <Calender events={eventDates} />
          </div>
        </Container>
          <div className="w-full lg:max-w-lg mx-auto">
            <CalenderMonthlyData data={data} />
          </div>
      </div>
    </div>
  )
}