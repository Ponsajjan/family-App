import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useState, useEffect } from 'react';
import AddLogin from './AddLogin';

function SwitchLoginList({initialActive}: any) {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [activeFamily, setActiveFamily] = useState<string | null>(null);

    // Format account name: replace _ with space and capitalize each word
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
                setActiveFamily(initialActive)
                
                // // Set first account as active by default if none is selected
                // if (parsedAccounts.length > 0 && !activeFamily) {
                //     setActiveFamily(parsedAccounts[0]);
                // }
            } catch (e) {
                console.error("Error parsing loggedAccounts cookie", e);
                // Fallback to treating the value as a single account
                const singleAccount = decodeURIComponent(cookieValue).replace(/^\["?|"?\]$/g, '');
                setAccounts([singleAccount]);
                if (!activeFamily) {
                    setActiveFamily(singleAccount);
                }
            }
        }
    }, []);

    const handleToggleChange = (member: string) => {
        if (activeFamily === member) {
            return;
        }
        setActiveFamily(member);
    };

    return (
        <>
            <div className='px-2 pt-3 pb-2 font-semibold border-b border-border_color text-text_color'>
                <span>Switch Login</span>
            </div>
            <div className='px-4 pt-4 pb-2 h-[30vh] md:h-full overflow-y-auto scroll-stable'>
                {accounts.map((account, index) => {
                    const formattedName = formatAccountName(account);
                    return (
                        <div key={index} className='py-0.5'>
                            <div className={`flex items-center justify-between transform transition-all duration-200 min-h-[40px] bg-field_color border border-l-4 ${account === activeFamily ? 'border-gray-500 text-gray-border-gray-500' : 'border-border_color text-text_color/45'} rounded-md cursor-pointer`}>
                                <div className='px-3'>{formattedName}</div>
                                <ToggleSwitch 
                                    isActive={account === activeFamily}
                                    className={`${account === activeFamily ? '' : 'opacity-45'}`}
                                    onChange={() => handleToggleChange(account)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='px-4 pb-4 border-t border-dashed pt-2'>
                <AddLogin />
            </div>
        </>
    )
}

export default SwitchLoginList;