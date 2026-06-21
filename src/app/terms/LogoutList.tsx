import { CloseIcon, Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setCookie, deleteCookie } from 'cookies-next';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useSWRConfig } from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setAccounts, setCurrentAuthId, setMainMemberName, setModeratorGroups, setChoosePopupAccounts, setIsModerator } from '@/store/slices/termsSlice';
import { appFetch } from "@/utils/appFetch";

function LogoutList({ showLogout, handleSidePanelToggle }: { showLogout: boolean, handleSidePanelToggle: (value: boolean) => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const { accounts, currentAuthId, moderatorGroups } = useSelector((state: RootState) => state.terms);
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
                key.startsWith('/api/tree') ||
                key.startsWith('/api/relatives') ||
                key.startsWith('/api/moderator') ||
                key.startsWith('/api/terms')
            )) {
                globalMutate(key, undefined, { revalidate: false });
            }
        });
    };

    const handleRemoveAccount = async (accountToRemove: string) => {
        // Track whether we fell back to a current: false account (needed for cookie update below)
        let fallbackAccount: typeof accounts[number] | undefined;

        // If removing the currently logged-in account
        if (accountToRemove === currentAuthId) {
            // 1. Try to find another account that is currently toggled ON (current: true)
            const nextAccount = accounts.find(acc => acc.current && String(acc.authId) !== String(accountToRemove));

            // 2. If none, fall back to any account that is toggled OFF (current: false)
            fallbackAccount = !nextAccount
                ? accounts.find(acc => !acc.current && String(acc.authId) !== String(accountToRemove))
                : undefined;

            const switchTo = nextAccount ?? fallbackAccount;

            if (switchTo) {
                try {
                    const response = await appFetch("/api/auth/switchLogin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ account: switchTo.authId }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        storeLoginValues(data.newtoken, data.userType, data.authId);
                        dispatch(setCurrentAuthId(data.authId));
                        dispatch(setMainMemberName(data.mainMemberName || 'Account'));
                        dispatch(setIsModerator(data.userType === "Moderator"));
                        clearFamilyCache();
                    } else {
                        toast?.show(data.error || "Failed to switch account automatically", "error", 3000);
                        return;
                    }
                } catch (err) {
                    console.error("Auto-switch error:", err);
                    return;
                }
            } else {
                // No accounts left to switch to — full logout
                logout();
                return;
            }
        }

        // Build the base list: if we switched to a fallback (current: false) account,
        // reflect its new current: true state before removing the outgoing account.
        const baseAccounts = fallbackAccount
            ? accounts.map(acc =>
                String(acc.authId) === String(fallbackAccount.authId)
                    ? { ...acc, current: true }
                    : acc
            )
            : accounts;

        const updatedAccounts = baseAccounts.filter(account => account.authId !== accountToRemove);
        dispatch(setAccounts(updatedAccounts));

        // Update the cookies
        const maxAge = 180 * 24 * 60 * 90;
        const selectedMaxAge = 60 * 60 * 24 * 90; // 90 days, matching SwitchLoginList

        if (updatedAccounts.length === 0) {
            deleteCookie('authId', { path: '/' });
            deleteCookie('selectedAuthId', { path: '/' });
            dispatch(setChoosePopupAccounts([]));
        } else {
            // Update authId cookie
            const authIdsOnly = updatedAccounts.map(account => account.authId);
            setCookie('authId', JSON.stringify(authIdsOnly), { maxAge, path: '/' });

            // Update selectedAuthId cookie (only those that are still 'current')
            const selectedAuthIds = updatedAccounts.filter(acc => acc.current).map(acc => acc.authId);
            setCookie('selectedAuthId', JSON.stringify(selectedAuthIds), { maxAge: selectedMaxAge, path: '/' });
            // Mirror exactly what went into the cookie
            dispatch(setChoosePopupAccounts(
                updatedAccounts
                    .filter(acc => acc.current)
                    .map(acc => ({ authId: acc.authId, name: acc.mainMemberRef }))
            ));
            // Update local state directly instead of another fetch
            const accountToRemoveObj = accounts.find(acc => acc.authId === accountToRemove);
            const familyIdToRemove = accountToRemoveObj?.familyId;
            const isFamilyStillPresent = updatedAccounts.some(acc => acc.familyId === familyIdToRemove);

            if (!isFamilyStillPresent && familyIdToRemove) {
                const updatedGroups = moderatorGroups.filter(g => g.id !== familyIdToRemove);
                dispatch(setModeratorGroups(updatedGroups));
            }

            clearFamilyCache();
        }
    };

    const logout = async () => {
        try {
            if (loggingOut) {
                return;
            }
            setLoggingOut(true);
            const response = await appFetch('/api/logout', { method: 'GET' });
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

    if (!showLogout) return null;

    return (
        <>
            <div className='sticky top-0 z-20 bg-main_background px-4 h-12 font-semibold border-b border-border_color text-text_color flex items-center justify-between'>
                <div>{loggingOut ? "Logging out..." : "Accounts"}</div>
                <div onClick={() => handleSidePanelToggle(false)} className='border border-border_color rounded-md cursor-pointer'>
                    <CloseIcon />
                </div>
            </div>

            {/* Current Account Section */}
            <div className='p-4 pb-3 border-b border-dashed w-full'>
                <div onClick={logout} className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[2.8125rem] bg-field_color text-text_color border border-border_color rounded-md cursor-pointer`}>
                    <div className="flex flex-col">
                        <div className="font-semibold">Logout</div>
                    </div>
                    <span className='hover:text-accent_color' title="Logout">
                        <Logout />
                    </span>
                </div>
            </div>

            {/* Other Accounts Section */}
            <div className='px-4 pt-2 pb-4'>
                {accounts.map((account) => (
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
                ))}
            </div>
        </>
    );
}

export default LogoutList;
