"use client"

import Container from '@/components/Container'
import Topnav from '@/components/Topnav'
import { Logout } from '@/utils/Icons'
import Link from 'next/link'
import { useState } from 'react'

export default function Terms() {
  const[showModerator, setShowModerator] = useState(false);

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

  return (
    <div className='flex flex-col w-full text-text_color'>
      <Topnav> </Topnav>
      <Container>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Shanmuga Nadar Family, Birthdays & Remembrances
          </h1>

          <p className="text-lg text-center mb-3">
            This app is created exclusively for the Shanmuga Nadar family to honor and remember significant dates, such as birthdays and remembrances.
          </p>

          <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Access is limited to:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Direct descendants of Shanmuga Nadar</li>
              <li>Their partner (spouse or significant other)</li>
            </ul>
            <p className="mt-4 italic opacity-65">
              Note: Extended family members (such as aunts, uncles, and cousins) are excluded to maintain simplicity and ensuring that each member remains relevant to each other.
            </p>
          </div>

          <div className="bg-field_color shadow-md border border-border_color rounded-lg mb-4">
            <div className='p-4'>
              <h2 className="text-xl font-semibold mb-4">Guidelines:</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Ensure family descendants are accurately recorded</li>
                <li>Add family relationships (Partner | Children) if any.</li>
              </ul>
              <p className="mt-4 italic opacity-65">
                Note: Family member information can be locked to maintain data integrity. For locked member, please submit a note for changes to be made or contact 
                the <span className='border-b border-border_color cursor-pointer' onClick={() => setShowModerator(prev => !prev)}>moderator</span> directly.
              </p>
            </div>
            {showModerator && <div className='border-t border-border_color p-4 flex justify-between'>
              <div>Moderator: Ponsajjan</div>
              <div>Contact: 9487244794</div>
            </div>}
          </div>
          <div className='flex justify-between'>
            <Link href="/terms/login">Login as Moderator</Link>
            <button onClick={logout} className="px-2 flex items-center gap-2"><Logout />Logout</button>
          </div>
        </div>
      </Container>
    </div>
  )
}