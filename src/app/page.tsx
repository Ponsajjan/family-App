import Calender from "@/components/Calender";
import DateList from "@/components/DateList";
import Topnav from "@/components/Topnav";
import Container from "@/components/Container";
import { AllDates } from "@/utils/Icons";


export default function Home() {

  return (
    <div className="w-full">
      <Topnav>
        <div className="ml-auto"><AllDates /></div>
      </Topnav>
      <div className="md:flex">
        <Container className='px-3 md:border-r md:border-border_color pb-3'>
          <Calender />
        </Container>
        <Container>
          <DateList/>
        </Container>
      </div>
    </div>
  )
}