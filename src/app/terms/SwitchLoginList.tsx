import ToggleSwitch from '@/components/ToggleSwitch';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function SwitchLoginList() {
    const family = ['family 1', 'family 2', 'Work', 'in', 'Progress'];
    const router = useRouter();
    const [activeFamilyMember, setActiveFamilyMember] = useState<string | null>('family 1');

    const handleToggleChange = (member: string) => {
      if (activeFamilyMember === member) {
        return;
      }
      setActiveFamilyMember(prev => prev === member ? null : member);
    };

    return (
      <>
        <div className='flex justify-between items-center px-2 py-2 font-semibold border-b border-border_color text-text_color'>
          <span>Switch Login</span>
        </div>
        <div className='p-4'>
          {family.map((m_member, index) => {
            return (
              <div onClick={() => handleToggleChange(m_member)} className='py-0.5' key={index}>
                <div className={`flex items-center justify-between transform transition-all duration-200 min-h-[40px] bg-field_color text-text_color border border-l-4 border-border_color rounded-md cursor-pointer`}>
                  <div className='px-3'>{m_member}</div>
                  <ToggleSwitch 
                    isActive={activeFamilyMember === m_member}
                  />
                </div>
              </div>
            );
          })}
          <span className='block border-b border-dashed pt-2 mb-2' />
          <div onClick={() => {router.push('/terms/add_login')}} className='flex items-center justify-between transform transition-all duration-200 px-3 min-h-[45px] bg-field_color text-text_color border border-l-4 border-border_color rounded-md cursor-pointer'>
            <span>Add Login</span>
            <span className='text-xl'>+</span>
          </div>
        </div>
      </>
    )
}

export default SwitchLoginList