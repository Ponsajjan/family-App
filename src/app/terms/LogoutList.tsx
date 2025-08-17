import ToggleSwitch from '@/components/ToggleSwitch';
import { CloseIcon, Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function LogoutList() {
    const family = ['family 1', 'family 2', 'Work', 'in', 'Progress'];
    const [activeFamilyMember, setActiveFamilyMember] = useState<string | null>('family 1');
    
    const handleToggleChange = (member: string) => {
      if (activeFamilyMember === member) {
        return;
      }
      setActiveFamilyMember(prev => prev === member ? null : member);
    };
    
    const router = useRouter();
    const logout = async () => {
      try {
        const response = await fetch('/api/logout', { method: 'GET' });
    
        if (response.ok) {
          router.push('/login');
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    return (
      <>
        <div className='px-2 pt-3 pb-2 font-semibold border-b border-border_color text-text_color'>
          <span>Logout</span>
        </div>
        <div className='px-4 pt-4 border-b border-dashed pb-2'>
          <div className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[45px] bg-field_color text-text_color border border-border_color rounded-md cursor-pointer`}>
            <div>Logout</div>
            <Logout />
          </div>
        </div>
        <div className='px-4 py-2 h-[30vh] md:h-full overflow-y-auto scroll-stable'>
          {family.map((m_member, index) => {
            return (
              <div key={index} onClick={() => handleToggleChange(m_member)} className='py-0.5'>
                <div className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[40px] bg-field_color text-text_color border border-l-4 border-border_color rounded-md cursor-pointer`}>
                  <div>{m_member}</div>
                  <CloseIcon />
                </div>
              </div>
            );
          })}
        </div>
      </>
    )
}

export default LogoutList