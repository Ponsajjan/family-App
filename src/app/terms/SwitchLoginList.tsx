import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useState } from 'react';
import AddLogin from './AddLogin';

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
        <div className='px-2 pt-3 pb-2 font-semibold border-b border-border_color text-text_color'>
          <span>Switch Login</span>
        </div>
        <div className='px-4 pt-4 pb-2 h-[30vh] md:h-full overflow-y-auto scroll-stable'>
          {family.map((m_member, index) => {
            return (
              <div key={index} className='py-0.5'>
                <div className={`flex items-center justify-between transform transition-all duration-200 min-h-[40px] bg-field_color border border-l-4 ${m_member == activeFamilyMember ? 'border-gray-500 text-gray-border-gray-500' : 'border-border_color text-text_color/45'} rounded-md cursor-pointer`}>
                  <div className='px-3'>{m_member}</div>
                  <ToggleSwitch 
                    isActive={activeFamilyMember === m_member}
                    className={`${m_member == activeFamilyMember ? '' : 'opacity-45'}`}
                    onChange={() => handleToggleChange(m_member)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className='px-4 pb-4 border-t border-dashed pt-2'>
          <AddLogin />
        </div>
      </>
    )
}

export default SwitchLoginList