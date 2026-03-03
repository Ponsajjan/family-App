"use client"

import Container from '@/components/Container'
import Topnav from '@/components/Topnav'
import { Community, InstallIcon, Logout, ShareLink, SwitchLogin } from '@/utils/Icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import SlidePanel from '@/components/SlidePanel'
import SwitchLoginList from './SwitchLoginList'
import LogoutList from './LogoutList'
import { usePWAInstall } from '@/utils/pwaUtils' // Adjust the import path as needed
import { deleteCookie } from 'cookies-next'
import { useAuth } from '@/contexts/AuthContext'

export default function Terms() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [moderatorList, setModeratorList] = useState([]);
  // const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  // const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const [mainMemberName, setMainMemberName] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [isModerator, setIsModerator] = useState(false);
  const router = useRouter();
  const { storeLoginValues, logout } = useAuth();

  // Use the PWA hook
  const { isPWA, triggerPWAInstall, showInstallButton } = usePWAInstall();

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
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMainMemberName(data.mainMemberName)
        setModeratorList(data.moderators)
        // setPassword(data.password)
        setAccounts(data.allAuthDetails)
        setIsModerator(data.userType === 'Moderator')


      } catch (error: any) {
        toast?.show(error.message || 'Failed to fetch page data', 'error', 5000);
      } finally {
        setLoading(false)
      }
    }
    fetchMembers();
  }, [router, toast]);

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

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(`Link: ${window.location.origin}\nPassword: ${password}`);
  //   setShowCopiedMsg(true);
  //   setTimeout(() => setShowCopiedMsg(false), 2000);
  // };

  const handleModeratorLogout = async () => {
    if (loading) return;

    try {
      const response = await fetch('/api/auth/moderator_logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout from moderator');
      }

      const data = await response.json();
      if (data.newtoken) {
        await storeLoginValues(data.newtoken, data.userType, data.authId, data.oldAuthId);
        toast?.show(data.message || 'Logout successfully', 'success', 5000);
        setIsModerator(false)
      } else {
        toast?.show(data.error || 'Logout failed', 'error', 5000);
      }
    } catch (error: any) {
      toast?.show(error.message || 'Failed to logout from moderator', 'error', 5000);
    }
  };


  return (
    <div className='flex flex-col w-full text-text_color'>
      <Topnav>
        <div onClick={() => handleSidePanelToggle('switchLogin')} className={`ml-auto mr-0 border border-border_color flex items-center justify-between rounded-md px-1 py-1 ${loading ? 'opacity-55 cursor-wait' : 'cursor-pointer'}`} title="Switch Account">
          <SwitchLogin />
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <Container>
          {loading ? <Loading /> :
            <div className="max-w-4xl mx-auto p-4 md:py-10">
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 sm:mb-4">
                {/* The {mainMemberName} Family, Birthdays & Remembrances */}
                Family, Birthdays & Remembrances Calendar
              </h1>
              {/* <p className="text-base sm:text-lg text-center mb-4">
                இந்த Web App, பிறந்தநாள் மற்றும் நினைவு நாட்கள் போன்ற முக்கிய நிகழ்வுகளைக் குடும்ப உறுப்பினர்கள் நினைவுகூரவும், சிறப்பிக்கவும் பிரத்யேகமாக உருவாக்கப்பட்டது.
              </p> */}

              <p className="text-base sm:text-lg text-center mb-3 md:px-10">
                This web app is exclusively for the {mainMemberName} family to honor and remember significant dates, such as birthdays and remembrances
              </p>

              <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
                <h2 className="text-xl flex items-center font-medium md:font-semibold mb-4">
                  <span className="inline-block mr-2"><Community /></span>
                  <span className="inline-block">Access is limited to:</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li className='list-outside'>Direct descendants of {mainMemberName}</li>
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
                    <li key={index} className='flex items-end justify-between mb-1'>
                      <span>{member.moderatorName}</span>
                      <span className='border-b border-dashed border-border_color block w-full mx-2 mb-2' />
                      <span>{member.moderatorContact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* <div className="relative">
                <div
                  onClick={handleCopy}
                  className="bg-field_hover shadow-md border border-border_color rounded-lg p-4 mb-4 flex items-center gap-2 cursor-pointer hover:bg-field_hover transition"
                >
                  <span className='w-5 h-5'>
                    <ShareLink />
                  </span>
                  {showCopiedMsg ?
                    <span>Copied to clipboard</span> :
                    <span>Share website link and password with family members</span>
                  }
                </div>
              </div> */}
              <div className='flex justify-between'>
                {isModerator ? (
                  <button onClick={handleModeratorLogout} className={loading ? 'opacity-55 cursor-wait' : 'cursor-pointer'}>
                    Logout from Moderator
                  </button>
                ) : (
                  <Link href="/terms/moderator_login">Login as Moderator</Link>
                )}
                <button onClick={() => handleSidePanelToggle('switchLogout')} className="px-2 flex items-center gap-2"><Logout />Logout</button>
              </div>

              {/* Fixed PWA Install Button - Show when NOT in PWA and when install is available */}
              {!isPWA() && showInstallButton && (
                <div
                  onClick={triggerPWAInstall}
                  className='md:hidden text-center border-y border-border_color mt-6 p-1 flex justify-center gap-2 items-center cursor-pointer hover:bg-field_hover transition-colors'
                >
                  Add to Home Screen <InstallIcon />
                </div>
              )}
            </div>}
        </Container>
        <SlidePanel setShowDetails={setShowSidePanel} showDetails={showSidePanel} >
          {showLogin &&
            <SwitchLoginList
              setMainMemberName={setMainMemberName}
              // setPassword={setPassword}
              setModeratorList={setModeratorList}
              accounts={accounts}
              setAccounts={setAccounts}
            />}
          {showLogout &&
            <LogoutList
              mainMemberName={mainMemberName}
              accounts={accounts}
              setAccounts={setAccounts}
            />}
        </SlidePanel>
      </div>
    </div>
  )
}