import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useState } from 'react'

function SwitchLoginList() {
    const family = ['family 1', 'family 2', 'Work', 'in', 'Progress'];
    const [activeFamilyMember, setActiveFamilyMember] = useState<string | null>('family 1');

    const handleToggleChange = (member: string) => {
        setActiveFamilyMember(prev => prev === member ? null : member);
    };

    return (
        <div className='p-4'>
            {family.map((m_member, index) => {
                return (
                  <div key={index} className="flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[60px] mb-2" >
                    <div className="w-full flex justify-between items-center">
                      <div className={`px-3 ${activeFamilyMember === m_member ? 'font-semibold text-lg' : 'font-normal text-base'}`}>{m_member}</div>
                        <ToggleSwitch 
                          isActive={activeFamilyMember === m_member}
                          onChange={() => handleToggleChange(m_member)}
                        />
                    </div>
                  </div>
                );
            })}
            <div className='flex justify-between items-center cursor-pointer mt-6 px-4 py-1 border border-border_color rounded-lg text-text_color'>
              <span>Add Another Login</span>
              <span className='text-xl'>+</span>
            </div>
        </div>
    )
}

export default SwitchLoginList