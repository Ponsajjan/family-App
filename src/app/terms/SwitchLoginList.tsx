import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useState, useEffect } from 'react';
import AddLogin from './AddLogin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

function SwitchLoginList({activeFamily, setActiveFamily}: any) {
    const [accounts, setAccounts] = useState<string[]>([]);
    const {storeLoginValues} = useAuth();
    const toast = useToast();
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
            setAccounts(JSON.parse(decodeURIComponent(cookieValue)));
        }
    }, []);

const handleToggleChange = async (account: string) => {
    if (activeFamily === account) {
        return;
    }
    try {
        const res = await fetch("/api/auth/switchLogin", {
            method: "POST",
            headers: { 
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ account }), // Send as object
        });

        const data = await res.json();
        if (data.newtoken) { // Check for token instead of newtoken
            storeLoginValues(data.newtoken, data.userType, data.forDescendanceOf);
            setActiveFamily(account);
        } else {
            toast?.show(data.error || "An unexpected error occurred.", "error", 5000);
        }
    } catch (error: any) {
        toast?.show(error.message || "An unexpected error occurred.", "error", 5000);
    }
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
            <div className='px-4 pb-4 border-t border-dashed pt-2 mr-[6px]'>
                <AddLogin />
            </div>
        </>
    )
}

export default SwitchLoginList;