"use client"

import { ButtonSolid } from '@/components/Button'
import Input from '@/components/Input'
import Topnav from '@/components/Topnav'
import RadioButton from "@/components/RadioButton";
import { useState } from 'react';
import { Logout } from '@/utils/Icons';
import Container from '@/components/Container';

export default function page() {
  const [validToken, setValidToken] = useState(true)

  const logout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'GET' });
  
      if (response.ok) {
        window.location.href = '/login';
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (validToken) {
    return (
      <div className='w-full'>
        <Topnav>
            <button onClick={logout} className="px-2 ml-auto mr-0 flex items-center gap-2"><Logout /></button>
        </Topnav>
        <Container>
          <div className='w-full max-w-3xl p-4 mx-auto'>
            <form className="text-text_color">
              <p className='text-lg'>For Descendents of</p>
              <Input
                name="name"
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
              <div className='mb-2'>
                <p className="text-sm font-medium">
                Date Of Death<span className="font-normal opacity-45 pl-2">(Optional)</span>
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
              <div className='flex gap-2'>
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
              </div>
              <Input
                className="mb-2"
                showOptional={true}
                name="siblings"
                label="Siblings"
              />
              <div className='flex gap-2'>
                <Input
                  className="mb-2"
                  type="number"
                  showOptional={true}
                  name="phone_number"
                  label="Contact"
                />
                <Input
                  className="mb-2"
                  showOptional={true}
                  name="occupation"
                  label="Occupation"
                />
              </div>
              <Input
                className="mb-2"
                showOptional={true}
                name="education"
                label="Education"
              />
              <Input
                className="mb-4"
                showOptional={true}
                name="address"
                label="Location State/Country"
              />
              <div className='flex gap-2'>
                <Input
                  className="mb-2"
                  required={true}
                  name="member_password"
                  label="Member Password"
                />
                <Input
                  className="mb-2"
                  required={true}
                  name="moderator_password"
                  label="Moderator Password"
                />
              </div>
              <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText={"Create Credential"} />
            </form>
          </div>
        </Container>
      </div>
    )
  } else {
    return (
      <p>Validating</p>
    )
  }
}
