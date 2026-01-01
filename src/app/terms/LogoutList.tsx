import { CloseIcon, Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface AccountDetail {
    authId: string;
    mainMemberRef: string;
    current: boolean;
}

interface LogoutListProps {
    mainMemberName: string;
    accounts: AccountDetail[];
    setAccounts: any;
    currentAuthId: string;
}

function LogoutList({ mainMemberName, accounts, setAccounts, currentAuthId }: LogoutListProps) {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const router = useRouter();

    // Get current account (where current: true)
    const currentAccount = accounts.find(account => account.current === true);

    const handleRemoveAccount = (accountToRemove: string) => {
        // Don't allow removing the currently logged in account
        if (accountToRemove === currentAuthId) {
            return;
        }

        const updatedAccounts = accounts.filter(account => account.authId !== accountToRemove);
        setAccounts(updatedAccounts);

        // Update the cookie with only authIds
        const daysToSeconds = 180 * 24 * 60 * 60;
        if (updatedAccounts.length === 0) {
            document.cookie = 'authId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        } else {
            // Extract only authIds for the cookie
            const authIdsOnly = updatedAccounts.map(account => account.authId);
            document.cookie = `authId=${encodeURIComponent(JSON.stringify(authIdsOnly))}; path=/; max-age=${daysToSeconds};`;
        }
    };

    const logout = async () => {
        try {
            if (loggingOut) {
                return;
            }
            setLoggingOut(true);
            const response = await fetch('/api/logout', { method: 'GET' });
            if (response.ok) {
                router.push('/login');
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    // Filter out current account from the list (current account shows at top separately)
    const otherAccounts = accounts.filter(account => !account.current);

    return (
        <>
            <div className='relative px-2 h-12 font-semibold border-b border-border_color text-text_color flex items-center justify-start'>
                <div className='z-10'>{loggingOut ? "Logging out..." : "Accounts"}</div>
            </div>

            {/* Current Account Section */}
            <div className='pl-4 pt-4 border-b border-dashed pb-2 pr-[22px] w-full'>
                <div className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[45px] bg-field_color text-text_color border border-border_color rounded-md cursor-pointer`}>
                    <div className="flex flex-col">
                        <div className="font-semibold">{currentAccount?.mainMemberRef || mainMemberName}</div>
                    </div>
                    <span onClick={logout} className='border-l border-border_color pl-3 hover:text-accent_color'>
                        <Logout />
                    </span>
                </div>
            </div>

            {/* Other Accounts Section */}
            <div className='px-4 py-2 h-[30vh] md:h-full overflow-y-auto scroll-stable'>
                {otherAccounts.map((account) => {
                    return (
                        <div key={account.authId} className='py-0.5 md:py-1 w-full'>
                            <div className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[40px] bg-field_color text-text_color border border-l-4 border-border_color rounded-md`}>
                                <div>{account.mainMemberRef}</div>
                                <span
                                    onClick={() => handleRemoveAccount(account.authId)}
                                    className="hover:text-accent_color border-l border-border_color pl-3 cursor-pointer"
                                    title="Remove from list"
                                >
                                    <CloseIcon />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default LogoutList;