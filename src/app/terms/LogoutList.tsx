import { CloseIcon, Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function LogoutList({activeFamily}: any) {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const router = useRouter();

    // Format account name: replace _ with space, capitalize each word, and remove everything after last _
    const formatAccountName = (account: string) => {
        if (!account) return '';
        
        // Replace underscores with spaces
        let formatted = account.replace(/_/g, ' ');
        
        // Capitalize first letter of each word
        formatted = formatted.replace(/\b\w/g, char => char.toUpperCase());
        
        // Remove everything after last space
        const lastSpaceIndex = formatted.lastIndexOf(' ');
        if (lastSpaceIndex !== -1) {
            formatted = formatted.substring(0, lastSpaceIndex);
        }
        
        return formatted;
    };

    // Fetch and parse loggedAccounts cookie
    useEffect(() => {
        const cookie = document.cookie.split('; ')
            .find(row => row.startsWith('loggedAccounts='));
        
        if (cookie) {
            const cookieValue = cookie.split('=')[1];
            try {
                // Decode and clean the value before parsing
                const decodedValue = decodeURIComponent(cookieValue)
                    .replace(/^\["?|"?\]$/g, '');
                
                // Split by "," and clean each item
                const parsedAccounts = decodedValue.split('","')
                    .map(item => item.replace(/"/g, '').trim())
                    .filter(item => item.length > 0);
                
                setAccounts(parsedAccounts);
            } catch (e) {
                console.error("Error parsing loggedAccounts cookie", e);
                // Fallback to treating the value as a single account
                setAccounts([decodeURIComponent(cookieValue).replace(/^\["?|"?\]$/g, '')]);
            }
        }
    }, []);

    const handleRemoveAccount = (accountToRemove: string) => {
        const updatedAccounts = accounts.filter(account => account !== accountToRemove);
        setAccounts(updatedAccounts);
        
        // Update or remove the cookie
        const daysToSeconds = 180 * 24 * 60 * 60;
        if (updatedAccounts.length === 0) {
            document.cookie = 'loggedAccounts=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        } else {
            document.cookie = `loggedAccounts=${encodeURIComponent(JSON.stringify(updatedAccounts))}; path=/; max-age=${daysToSeconds};`;
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

    return (
        <>
            <div className='relative px-2 h-12 font-semibold border-b border-border_color text-text_color flex items-center justify-start'>
                <div className='z-10'>{loggingOut ? "Logging out..." : "Logout"}</div>
            </div>
            <div className='px-4 pt-4 border-b border-dashed pb-2 mr-[6px] w-full'>
                <div onClick={logout} className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[45px] bg-field_color text-text_color border border-border_color rounded-md cursor-pointer`}>
                    <div>{formatAccountName(activeFamily)}</div>
                    <Logout />
                </div>
            </div>
            <div className='px-4 py-2 h-[30vh] md:h-full overflow-y-auto scroll-stable'>
              {accounts.filter(account => account !== activeFamily).map((account, index) => {
                  const formattedName = formatAccountName(account);
                  return (
                    <div key={index} className='py-0.5 w-full'>
                        <div className={`flex items-center justify-between transform transition-all duration-200 px-3 min-h-[40px] bg-field_color text-text_color border border-l-4 border-border_color rounded-md cursor-pointer`}>
                            <div>{formattedName}</div>
                            <div onClick={() => handleRemoveAccount(account)} className="hover:text-accent_color">
                                <CloseIcon />
                            </div>
                        </div>
                    </div>
                  );
              })}
            </div>
        </>
    );
}

export default LogoutList;