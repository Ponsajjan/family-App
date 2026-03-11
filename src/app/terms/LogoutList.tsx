import { CloseIcon, Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setCookie, deleteCookie } from 'cookies-next';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useSWRConfig } from 'swr';

interface AccountDetail {
    authId: string;
    mainMemberRef: string;
    current: boolean;
}

interface LogoutListProps {
    accounts: AccountDetail[];
    setAccounts: any;
    currentAuthId: string;
    setCurrentAuthId: (value: string) => void;
    setMainMemberName: (value: string) => void;
    setModeratorList: (value: any) => void;
}

function LogoutList({ accounts, setAccounts, currentAuthId, setCurrentAuthId, setMainMemberName, setModeratorList }: LogoutListProps) {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const router = useRouter();
    const { storeLoginValues } = useAuth();
    const toast = useToast();
    const { cache, mutate: globalMutate } = useSWRConfig();

    const clearFamilyCache = () => {
        const allKeys = Array.from(cache.keys());
        allKeys.forEach(key => {
            if (typeof key === 'string' && (
                key.startsWith('/api/calendar/') || 
                key.startsWith('/api/tree/') || 
                key.startsWith('/api/relatives')
            )) {
                globalMutate(key, undefined, { revalidate: false });
            }
        });
    };

    const handleRemoveAccount = async (accountToRemove: string) => {
        // If removing the currently logged-in account
        if (accountToRemove === currentAuthId) {
            // Find another account that is currently toggled ON
            const nextAccount = accounts.find(acc => acc.current && String(acc.authId) !== String(accountToRemove));

            if (nextAccount) {
                try {
                    const response = await fetch("/api/auth/switchLogin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ account: nextAccount.authId }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        storeLoginValues(data.newtoken, data.userType, data.authId);
                        setCurrentAuthId(data.authId);
                        setMainMemberName(data.mainMemberName || 'Account');
                        setModeratorList(data.moderators);
                        clearFamilyCache();
                        // toast?.show(`Switched to ${data.mainMemberName || 'Account'}`, "success", 3000);
                    } else {
                        toast?.show(data.error || "Failed to switch account automatically", "error", 3000);
                        return; // Don't remove if switch failed? Or just continue? 
                        // User requirement says switch with another active account. If switch fails, maybe we shouldn't remove it yet to avoid breaking session.
                    }
                } catch (err) {
                    console.error("Auto-switch error:", err);
                    // toast?.show("Error switching account", "error", 3000);
                    return;
                }
            } else {
                // If no other active accounts, we might want to prevent removal or force a full logout
                // For now, let's just log out if it's the only active one being removed
                logout();
                return;
            }
        }

        const updatedAccounts = accounts.filter(account => account.authId !== accountToRemove);
        setAccounts(updatedAccounts);

        // Update the cookies
        const maxAge = 180 * 24 * 60 * 90;
        const selectedMaxAge = 60 * 60 * 24 * 90; // 90 days, matching SwitchLoginList

        if (updatedAccounts.length === 0) {
            deleteCookie('authId', { path: '/' });
            deleteCookie('selectedAuthId', { path: '/' });
        } else {
            // Update authId cookie
            const authIdsOnly = updatedAccounts.map(account => account.authId);
            setCookie('authId', JSON.stringify(authIdsOnly), { maxAge, path: '/' });

            // Update selectedAuthId cookie (only those that are still 'current')
            const selectedAuthIds = updatedAccounts.filter(acc => acc.current).map(acc => acc.authId);
            setCookie('selectedAuthId', JSON.stringify(selectedAuthIds), { maxAge: selectedMaxAge, path: '/' });
            clearFamilyCache();
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
                clearFamilyCache();
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

    return (
        <>
            <div className='relative px-2 h-12 font-semibold border-b border-border_color text-text_color flex items-center justify-start'>
                <div className='z-10'>{loggingOut ? "Logging out..." : "Accounts"}</div>
            </div>

            {/* Current Account Section */}
            <div className='pl-4 pt-4 border-b border-dashed pb-2 pr-[1.375rem] w-full'>
                <div className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[2.8125rem] bg-field_color text-text_color border border-border_color rounded-md cursor-pointer`}>
                    <div className="flex flex-col">
                        <div className="font-semibold">Logout</div>
                    </div>
                    <span onClick={logout} className='border-l border-border_color pl-3 hover:text-accent_color' title="Logout">
                        <Logout />
                    </span>
                </div>
            </div>

            {/* Other Accounts Section */}
            <div className='px-4 py-2 h-[30vh] md:h-full overflow-y-auto scroll-stable'>
                {accounts.map((account) => {
                    return (
                        <div key={account.authId} className='py-0.5 md:py-1 w-full'>
                            <div className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[2.5rem] bg-field_color text-text_color border border-l-4 border-border_color rounded-md`}>
                                <div>{account.mainMemberRef}</div>
                                {accounts.length > 1 && <span
                                    onClick={() => handleRemoveAccount(account.authId)}
                                    className="hover:text-accent_color border-l border-border_color pl-3 cursor-pointer"
                                    title="Remove from list"
                                >
                                    <CloseIcon />
                                </span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default LogoutList;
