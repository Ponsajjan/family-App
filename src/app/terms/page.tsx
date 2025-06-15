"use client"

import Container from '@/components/Container'
import Topnav from '@/components/Topnav'
import { Community, Logout } from '@/utils/Icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'

export default function Terms() {
  const toast = useToast();
  const[loading, setLoading] = useState(true)
  const[head, setHead] = useState('')
  const[moderatorList, setModeratorList] = useState([])
  const router = useRouter(); 

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true)
        const response = await fetch(`/api/terms`,
          {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json'
            },
          }
        );
        // Handle 401 Unauthorized
        if (response.status === 401) {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHead(data.member['name'])
        setModeratorList(data.moderators)
        
      } catch (error: any) {
        toast?.show(error.message || 'Failed to fetch page data', 'error', 5000);
      } finally {
        setLoading(false)
      }
    }

    fetchMembers();
  }, [router, toast]);

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
        {loading ? <Loading /> :
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 sm:mb-4">
            {head} Family, Birthdays & Remembrances
          </h1>

          <p className="text-sm sm:text-lg text-center mb-3">
            This web app is created exclusively for the {head} family to honor and remember significant dates, such as birthdays and remembrances
          </p>

          <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
            <h2 className="text-xl flex items-center font-medium md:font-semibold mb-4">
              <span className="inline-block mr-2"><Community /></span>
              <span className="inline-block">Access is limited to:</span>
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Direct descendants of {head}</li>
              <li>Their partner ( Husband or Wife )</li>
            </ul>
            <p className="mt-4 italic opacity-65">
              Note: Extended family members (in-laws) are excluded to maintain simplicity and ensure that each listed member is directly relevant
            </p>
          </div>

          <div className="bg-field_color shadow-md border border-border_color rounded-lg mb-6">
            <div className='p-4'>
              <h2 className="text-xl flex items-center font-medium md:font-semibold mb-4">
                <span className="inline-block mr-2"><Community /></span>
                <span className="inline-block">Guidelines:</span>
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Ensure family descendants are accurately recorded</li>
                <li>Add family relationships ( Partner | Children ) if applicable</li>
                <li>New members remain hidden from the relations chart until they are verified</li>
              </ul>
              <p className="mt-4 italic opacity-65">
                Note: Verified member information is locked to preserve data integrity. Any updates to verified members require a moderator approval
              </p>
            </div>
          </div>

          <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-4">
            <div className="text-xl font-medium md:font-semibold mb-4">
              {(moderatorList.length > 1) ? 'Moderators:' : 'Moderator:'}
            </div>
            <ul>
              {moderatorList.map((member:any, index:number) => (
                <li key={index} className='flex items-baseline justify-between mb-1'>
                  <span>{member.moderatorName}</span>
                  <span className='border-b border-dashed border-border_color block w-full mx-2'/>
                  <span>{member.moderatorContact}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex justify-between'>
            <Link href="/terms/login">Login as Moderator</Link>
            <button onClick={logout} className="px-2 flex items-center gap-2"><Logout />Logout</button>
          </div>
        </div>}
      </Container>
    </div>
  )
}