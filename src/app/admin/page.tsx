import { ButtonSolid, LinkButtonOutline } from '@/components/Button'
import Input from '@/components/Input'
import Topnav from '@/components/Topnav'
import RadioButton from "@/components/RadioButton";

export default function page() {
  return (
    <div className='w-full'>
      <Topnav />
      <div className='p-4 w-full'>
        <div className=' max-w-3xl mx-auto'>
          <h1 className='text-2xl font-semibold mt-1 text-text_color'>Create New Credential</h1>
          <div className='w-full mt-4'>
          <form className="text-text_color">
            <Input
              name="name"
              label="For Descendents of"
            />
            <div className="py-4">
            <div className="flex gap-2">
                <p className="text-sm font-medium">Gender:</p>
                <RadioButton
                  label="Male"
                  name="gender"
                  value="Male"
                />
                <RadioButton
                  label="Female"
                  name="gender"
                  value="Female"
                />
            </div>
            </div>
            <div>
            <p className="text-sm font-medium">
                Date Of Birth<span className="font-normal opacity-45 pl-2">(Optional)</span>
            </p>
            <div className="w-full mb-2 flex gap-2">
                <Input
                  type="number"
                  placeholder="DD"
                  name="birth_date"
                  min="1"
                  max="31"
                  maxLength={2}
                  label=""
                />
                <Input
                  type="number"
                  placeholder="MM"
                  name="birth_month"
                  min="1"
                  max="12"
                  maxLength={2}
                  label=""
                />
                <Input
                  type="number"
                  placeholder="YYYY(Opt)"
                  name="birth_year"
                  min="1975"
                  max={new Date().getFullYear()}
                  maxLength={4}
                  label=""
                />
            </div>
            </div>
            <div className="relative py-2">
              <div className="pb-2">
                  <p className="text-sm font-medium pr-2 inline-block">Deceased</p>
                  <input
                    type="checkbox"
                    className="peer align-middle inline-block bg-main_background border border-border_active rounded-md"
                    name="deceased"
                  />
              </div>

              <div className={` pt-2`}>
                  <p className="text-sm font-medium">
                  Date Of Death<span className="font-normal opacity-45 pl-2">(Optional)</span>
                  </p>
                  <p className="text-xs font-extralight absolute top-[14px] left-[100px]">
                  (Remove checkmark if not Deceased)
                  </p>
                  <div className="w-full flex gap-2">
                  <Input
                    type="number"
                    placeholder="DD(Opt)"
                    name="death_date"
                    min="1"
                    max="31"
                    maxLength={2}
                    label=""
                  />
                  <Input
                    type="number"
                    placeholder="MM"
                    name="death_month"
                    min="1"
                    max="12"
                    maxLength={2}
                    label=""
                  />
                  <Input
                    type="number"
                    placeholder="YYYY"
                    name="death_year"
                    min="1975"
                    max={new Date().getFullYear()}
                    maxLength={4}
                    label=""
                  />
                  </div>
              </div>
            </div>
            <Input
              className="mb-2"
              showOptional={true}
              name="father"
              label="Father"
            />
            <Input
              className="mb-2"
              showOptional={true}
              name="mother"
              label="Mother"
            />
            <Input
              className="mb-2"
              showOptional={true}
              name="siblings"
              label="Siblings"
            />
            <Input
              className="mb-2"
              type="number"
              showOptional={true}
              name="phone_number"
              label="Phone Number"
            />
            <Input
              className="mb-2"
              showOptional={true}
              name="occupation"
              label="Occupation"
            />
            <Input
              className="mb-2"
              showOptional={true}
              name="education"
              label="Education"
            />
            <Input
              className="mb-10"
              showOptional={true}
              name="address"
              label="Location State/Country"
            />
            <Input
              className="mb-2"
              required={true}
              name="password"
              label="Password"
            />
            <div>
              Moderator Name contact passsword
            </div>
            <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText={"Create Credential"} />
        </form>
          </div>

          <div className='w-full max-w-3xl mx-auto'>
            <h1 className='text-3xl font-bold pt-10 pb-1'>List of logins</h1>
            <table>
              <thead>
                <tr>
                  <th>For descendance of</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Alfreds Futterkiste</td>
                  <td>Maria Anders</td>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>Centro comercial Moctezuma</td>
                  <td>Francisco Chang</td>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>Ernst Handel</td>
                  <td>Roland Mendel</td>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>Island Trading</td>
                  <td>Helen Bennett</td>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>Laughing Bacchus Winecellars</td>
                  <td>Yoshi Tannamuri</td>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>Magazzini Alimentari Riuniti</td>
                  <td>Giovanni Rovelli</td>
                  <td>hi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
