"use client"

import Container from '@/components/Container'
import Topnav from '@/components/Topnav'
import { Community, Logout, SwitchLogin } from '@/utils/Icons'
import { useState, useEffect } from 'react'
import SlidePanel from '@/components/SlidePanel'
import SwitchLoginList from './SwitchLoginList'
import LogoutList from './LogoutList'
// import { usePWAInstall } from '@/utils/pwaUtils' // Adjust the import path as needed
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function TermsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { loading } = useSelector((state: RootState) => state.terms);
    const [showLogin, setShowLogin] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [showSidePanel, setShowSidePanel] = useState(false);

    // Use the PWA hook
    // const { isPWA, triggerPWAInstall, showInstallButton } = usePWAInstall();


    useEffect(() => {
        if (!showSidePanel) {
            setShowLogin(false);
            setShowLogout(false);
        }
    }, [showSidePanel]);

    const handleSidePanelToggle = (value: 'switchLogin' | 'switchLogout') => {
        if (loading) {
            return;
        }

        if (value === 'switchLogin') {
            if (showSidePanel && showLogin) {
                setShowSidePanel(false);
                setShowLogin(false);
            } else {
                setShowSidePanel(true);
                setShowLogin(true);
                setShowLogout(false);
            }
        } else if (value === 'switchLogout') {
            if (showSidePanel && showLogout) {
                setShowSidePanel(false);
                setShowLogout(false);
            } else {
                setShowSidePanel(true);
                setShowLogin(false);
                setShowLogout(true);
            }
        }
    };

    // const handleCopy = () => {
    //   navigator.clipboard.writeText(`Link: ${window.location.origin}\nPassword: ${password}`);
    //   setShowCopiedMsg(true);
    //   setTimeout(() => setShowCopiedMsg(false), 2000);
    // };


    return (
        <div className='flex flex-col w-full text-text_color'>
            <Topnav>
                <button
                    type="button"
                    onClick={() => handleSidePanelToggle('switchLogin')}
                    disabled={loading}
                    className={`ml-auto mr-0 border border-border_color flex items-center justify-between rounded-md px-1 py-1 bg-transparent text-inherit focus:outline-none ${loading ? 'opacity-55 cursor-wait' : 'cursor-pointer'}`}
                    title="Switch Account"
                >
                    <SwitchLogin />
                </button>
            </Topnav>
            <div className="w-full md:flex">
                <Container>
                    <div className="max-w-4xl mx-auto p-4 md:pt-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 sm:mb-4">
                            Family, Birthdays & Remembrances
                        </h1>

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

                        {children}
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
                        <div className="ml-auto mr-0 w-fit block">
                            <button onClick={() => handleSidePanelToggle('switchLogout')} className="px-2 flex items-center gap-2"><Logout />Logout</button>
                        </div>

                        {/* Fixed PWA Install Button - Show when NOT in PWA and when install is available */}
                        {/* {!isPWA() && showInstallButton && (
                            <div
                                onClick={triggerPWAInstall}
                                className='md:hidden text-center border-y border-border_color mt-6 p-1 flex justify-center gap-2 items-center cursor-pointer hover:bg-field_hover transition-colors'
                            >
                                Add to Home Screen <InstallIcon />
                            </div>
                        )} */}
                    </div>
                </Container>
                <SlidePanel setShowDetails={setShowSidePanel} showDetails={showSidePanel} >
                    {showLogin && <SwitchLoginList />}
                    {showLogout && <LogoutList />}
                </SlidePanel>
            </div>
        </div>
    )
}