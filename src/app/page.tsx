import Calender from "./Calender";
import CalenderMonthlyData from "./CalenderMonthlyData";
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
        <Container className='px-3 md:border-r md:border-border_color pb-3 w-full max-w-5xl'>
          <div className="w-full lg:max-w-xl mx-auto">
            <Calender />
          </div>
        </Container>
          <div className="w-full lg:max-w-lg mx-auto">
            <CalenderMonthlyData/>
          </div>
      </div>
    </div>
  )
}