import { HoldTextButton } from '@/components/HoldButton';
import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useState } from 'react'

function SwitchLoginList() {
    const family = ['family 1', 'family 2', 'Work', 'in', 'Progress'];
    const [activeFamilyMember, setActiveFamilyMember] = useState<string | null>('family 1');

    const handleToggleChange = (member: string) => {
      if (activeFamilyMember === member) {
        return;
      }
      setActiveFamilyMember(prev => prev === member ? null : member);
    };

    return (
      <>
        <div className='px-4 py-2 border-b border-border_color text-text_color'>
          <span>Switch Login</span>
        </div>
        <div className='p-4'>
          {family.map((m_member, index) => {
            return (
              <HoldTextButton onClick={() => handleToggleChange(m_member)} className={`w-full ${activeFamilyMember === m_member ? '' : 'py-0.5'}`} key={index}>
                <div className={`w-full flex items-center justify-between transform transition-all duration-200 ${activeFamilyMember === m_member ? 'font-medium text-base scale-[1.02] shadow-md min-h-[41px] ' : 'min-h-[40px] opacity-70'} bg-field_color text-text_color border border-l-4 border-border_color rounded-md cursor-pointer`}>
                  <div className='px-3'>{m_member}</div>
                  <ToggleSwitch 
                    isActive={activeFamilyMember === m_member}
                  />
                </div>
              </HoldTextButton>
            );
          })}
          <div className='flex justify-between items-center cursor-pointer mt-6 px-4 py-1 border border-border_color rounded-lg text-text_color'>
            <span>Add Login</span>
            <span className='text-xl'>+</span>
          </div>
        </div>
      </>
    )
}

export default SwitchLoginList