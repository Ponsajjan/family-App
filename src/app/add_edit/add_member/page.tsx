"use server"

import Container from "@/components/Container";
import { ButtonSolid } from '@/components/Button'
import Input from "@/components/Input"
import RadioButton from "@/components/RadioButton"
import addUserAction from "./action"
import Link from "next/link";
import { SvgArrow } from "@/utils/Icons";

export default async function AddUser() {
  return (
      <Container className="px-3 pt-4 w-full md:w-3/4 mx-auto">
          <div className="w-full md:max-w-xl mx-auto">
            <Link href={"/add_edit"} className="block mb-6"><SvgArrow/> Back</Link>
            <form className='text-text_color' action={addUserAction} >
                <Input className="mb-2" name="name" label="Name" placeholder="Name" />
                <div className='flex gap-2 pt-2 pb-4 '>
                    <p className="text-sm font-medium">Gender:</p>
                    <RadioButton label="Male" name="gender" value="Male" checked />
                    <RadioButton label="Female" name="gender" value="Female" />
                </div>
                <div>
                    <p className="text-sm font-medium">Date Of Birth <span className='font-normal opacity-45'>(Optional)</span></p>
                    <div className="w-full mb-2 flex gap-2">
                        <Input type="number" placeholder="DD" name="birth_date" min="1" max="31" label="" />
                        <Input type="number" placeholder="MM" name="birth_month" min="1" max="12" label="" />
                        <Input type="number" placeholder="YYYY" name="birth_year" min="1975" max="2025" label="" />
                    </div>
                </div>
                <div className="flex items-center gap-2 py-2 flex-wrap relative">
                    <p className="text-sm font-medium">Deceased</p>
                    <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />

                    <div className="hidden peer-checked:block">
                        <p className='text-xs font-extralight absolute top-3 left-28'>(Remove checkmark if not Deceased)</p>
                        <p className="text-sm font-medium">Date Of Death <span className='font-normal opacity-45'>(Optional)</span></p>
                        <div className="w-full mb-2 flex gap-2">
                            <Input type="number" placeholder="DD" name="death_date" label="" />
                            <Input type="number" placeholder="MM" name="death_month" label="" />
                            <Input type="number" placeholder="YYYY" name="death_year" label="" />
                        </div>
                    </div>
                </div>
                <Input className="mb-2" type="number" placeholder="Phone Number" name="phone_number" label="Phone Number" />
                <Input className="mb-2" placeholder="Occupation" name="occupation" label="Occupation" />
                <Input className="mb-2" placeholder="Education" name="education" label="Education" />
                <Input className="mb-8" placeholder="Address" name="address" label="Address" />

                <ButtonSolid type="submit" className='w-full mb-4' buttonText="Add Member"/>
            </form>
          </div>
      </Container>
  )
}
