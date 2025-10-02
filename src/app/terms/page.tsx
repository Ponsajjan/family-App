"use client"

import Container from '@/components/Container'
import Topnav from '@/components/Topnav'
import { Community, Logout, ShareLink, SwitchLogin } from '@/utils/Icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import SlidePanel from '@/components/SlidePanel'
import SwitchLoginList from './SwitchLoginList'
import LogoutList from './LogoutList'

export default function Terms() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [head, setHead] = useState('');
  const [moderatorList, setModeratorList] = useState([]);
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [showCopiedMsg, setShowCopiedMsg] = useState(false); // Added missing state
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
        setActiveFamily(data.member['descendantOf'])
        setModeratorList(data.moderators)
        setPassword(data.password)

      } catch (error: any) {
        toast?.show(error.message || 'Failed to fetch page data', 'error', 5000);
      } finally {
        setLoading(false)
      }
    }

    fetchMembers();
  }, [router, toast, refetch]);

  const handleSidePanelToggle = (value: 'switchLogin' | 'switchLogout') => {
    if (loading) {
      return
    }
    if (value === 'switchLogin') {
      setShowSidePanel(true);
      setShowLogin(true);
      setShowLogout(false);
    };
    if (value === 'switchLogout') {
      setShowSidePanel(true);
      setShowLogin(false);
      setShowLogout(true);
    };
    if (value === 'switchLogin' && showLogin) {
      setShowSidePanel(false);
      setShowLogin(false);
      setShowLogout(false);
      return;
    }
    if (value === 'switchLogout' && showLogout) {
      setShowSidePanel(false);
      setShowLogin(false);
      setShowLogout(false);
      return;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Link: ${window.location.href}\nPassword: ${password}`);
    setShowCopiedMsg(true);
    setTimeout(() => setShowCopiedMsg(false), 2000);
  };


  return (
    <div className='flex flex-col w-full text-text_color'>
      <Topnav>
        <div onClick={() => handleSidePanelToggle('switchLogin')} className={`ml-auto mr-0 border border-border_color flex items-center justify-between rounded-md px-1 py-1 ${loading ? 'opacity-55 cursor-wait' : 'cursor-pointer'}`}>
          <SwitchLogin />
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <Container>
          {loading ? <Loading /> :
            <div className="max-w-4xl mx-auto p-4 md:py-10">
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 sm:mb-4">
                {head} Family, Birthdays & Remembrances
              </h1>

              <p className="text-base sm:text-lg text-center mb-3">
                This web app is created exclusively for the {head} family to honor and remember significant dates, such as birthdays and remembrances
              </p>

              <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
                <h2 className="text-xl flex items-center font-medium md:font-semibold mb-4">
                  <span className="inline-block mr-2"><Community /></span>
                  <span className="inline-block">Access is limited to:</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li className='list-outside'>Direct descendants of {head}</li>
                  <li className='list-outside'>Their partner ( Husband or Wife )</li>
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
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li className='list-outside'>Ensure family descendants are accurately recorded</li>
                    <li className='list-outside'>Add family relationships <span className='whitespace-nowrap'>( Partner | Children )</span> if applicable</li>
                    <li className='list-outside'>New members remain hidden in Calendar and Relations chart until they are verified</li>
                  </ul>
                  <p className="mt-4 italic opacity-65">
                    Note: Verified member information is locked to preserve data integrity. Any updates to verified members require moderator approval
                  </p>
                </div>
              </div>

              <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
                <div className="text-xl font-medium md:font-semibold mb-4">
                  {(moderatorList.length > 1) ? 'Moderators:' : 'Moderator:'}
                </div>
                <ul>
                  {moderatorList.map((member: any, index: number) => (
                    <li key={index} className='flex items-baseline justify-between mb-1'>
                      <span>{member.moderatorName}</span>
                      <span className='border-b border-dashed border-border_color block w-full mx-2' />
                      <span>{member.moderatorContact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div
                  onClick={handleCopy}
                  className="bg-field_hover shadow-md border border-border_color rounded-lg p-4 mb-4 flex items-center gap-2 cursor-pointer hover:bg-field_hover transition"
                >
                  <ShareLink />
                  {showCopiedMsg ?
                    <span>Copied to clipboard</span> :
                    <span>Share page link and password with family members</span>
                  }
                </div>
              </div>
              <div className='flex justify-between'>
                <Link href="/terms/moderator_login">Login as Moderator</Link>
                <button onClick={() => handleSidePanelToggle('switchLogout')} className="px-2 flex items-center gap-2"><Logout />Logout</button>
              </div>
            </div>}
        </Container>
        <SlidePanel setShowDetails={setShowSidePanel} showDetails={showSidePanel} >
          {showLogin && <SwitchLoginList activeFamily={activeFamily} setActiveFamily={setActiveFamily} setRefetch={setRefetch} />}
          {showLogout && <LogoutList activeFamily={activeFamily} />}
        </SlidePanel>
      </div>
    </div>
  )
}