import ToggleSwitch from '@/components/ToggleSwitch';
import { Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function LogoutList() {
    const family = ['family 1', 'family 2', 'Work', 'in', 'Progress'];
    const [activeFamilyMember, setActiveFamilyMember] = useState<string | null>('family 1');
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
        <div className='flex justify-between items-center px-4 py-2 border-b border-border_color text-text_color'>
          <span>Logout</span>
        </div>
        <div className='p-4'>
            {family.map((m_member, index) => {
                return (
                  <div key={index} className="flex items-center bg-field_color text-text_color border border-l-4 border-border_color rounded-md min-h-[40px] mb-1" >
                    <div className="w-full flex justify-between items-center px-3">
                        <div className={`${activeFamilyMember === m_member ? 'font-semibold text-lg' : 'font-normal text-base'}`}>{m_member}</div>
                        <Logout />
                    </div>
                  </div>
                );
            })}
        </div>
      </>
    )
}

export default LogoutList