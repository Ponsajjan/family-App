import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

interface AccountDetail {
    authId: string;
    mainMemberRef: string;
    current: boolean;
}

interface SwitchLoginListProps {
    setMainMemberName: (value: string) => void;
    accounts: AccountDetail[];
    setAccounts: any;
}

function SwitchLoginList({ setMainMemberName, accounts, setAccounts }: SwitchLoginListProps) {
    const [switchingAccount, setSwitchingAccount] = useState<boolean>(false);
    const [form, setForm] = useState({ password: "" });
    const [error, setError] = useState("");
    const { storeLoginValues } = useAuth();
    const toast = useToast();

    const handleToggleChange = async (account: AccountDetail) => {
        // Don't switch if it's already the current account or switching is in progress
        if (account.current || switchingAccount) {
            return;
        }

        try {
            setSwitchingAccount(true);
            const res = await fetch("/api/auth/switchLogin", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ account: account.authId }), // Send the authId
            });

            const data = await res.json();
            if (data.newtoken) {
                // Pass the old authId (current one) and new authId to storeLoginValues
                storeLoginValues(data.newtoken, data.userType, data.authId);
                setAccounts((prev: AccountDetail[]) =>
                    prev.map(acc => ({
                        ...acc,
                        current: acc.authId === account.authId
                    }))
                );
                setMainMemberName(data.mainMemberName);
            } else {
                toast?.show(data.error || "An unexpected error occurred.", "error", 5000);
            }
        } catch (error: any) {
            toast?.show(error.message || "An unexpected error occurred.", "error", 5000);
        } finally {
            setSwitchingAccount(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check max accounts limit
        if (accounts.length >= 10) {
            setError("You have reached the maximum number of accounts (10).");
            return;
        }

        try {
            if (!form.password) {
                return;
            }

            setSwitchingAccount(true);
            const res = await fetch("/api/auth/add_login", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.token) {
                // Check if account already exists
                const accountExists = accounts.some(acc => acc.authId === data.authId);
                if (accountExists) {
                    setError("Account already exists in your list.");
                    setSwitchingAccount(false);
                    return;
                }

                // Add the new account to the list as current
                const newAccount: AccountDetail = {
                    authId: data.authId,
                    mainMemberRef: data.mainMemberName || 'New Account', // Use name from response
                    current: true // Set as current since we're switching to it
                };

                const updatedAccounts = [
                    ...accounts.map(acc => ({ ...acc, current: false })), // Set all existing accounts to non-current
                    newAccount // Add new account as current
                ];

                storeLoginValues(data.token, data.userType, data.authId);
                setForm({ password: "" });
                setAccounts(updatedAccounts);
                setError("");
                setMainMemberName(data.mainMemberName || 'New Account');
            } else {
                setError(data.error || "Failed to add account");
            }
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred");
        } finally {
            setSwitchingAccount(false);
        }
    };

    return (
        <>
            <div className='relative px-2 h-12 font-semibold border-b border-border_color text-text_color flex items-center justify-start'>
                <div className='z-10'>{switchingAccount ? "Switching..." : "Switch Login"}</div>
            </div>

            <div className='px-4 pt-4 pb-2 h-[30vh] md:h-full overflow-y-auto scroll-stable'>
                {accounts.map((account) => {
                    const isCurrentAccount = account.current;
                    return (
                        <div key={account.authId} className='py-0.5 md:py-1 w-full'>
                            <div
                                onClick={() => !isCurrentAccount && handleToggleChange(account)}
                                className={`flex items-center justify-between transform transition-all duration-200 min-h-[40px] bg-field_color border border-l-4 ${isCurrentAccount
                                    ? 'border-gray-500 text-gray-border-gray-500 cursor-default'
                                    : 'border-border_color text-text_color/45 cursor-pointer hover:bg-field_color/80'
                                    } rounded-md`}
                            >
                                <div className="font-medium px-3">{account.mainMemberRef}</div>
                                <ToggleSwitch
                                    isActive={isCurrentAccount}
                                    className={isCurrentAccount ? '' : 'opacity-45'}
                                />
                            </div>
                        </div>
                    );
                })
                }
            </div>

            <div className='px-4 pb-4 border-t border-dashed pt-2 mr-[6px]'>
                <form onSubmit={handleSubmit}>
                    <div className='flex h-12 border border-border_color bg-field_color opacity-85 rounded-md overflow-hidden px-2 relative'>
                        <label className='flex items-center w-full relative'>
                            <span className={`absolute left-1 text-text_color/55 transition-all duration-200 pointer-events-none pt-0.5 ${form.password ? 'text-sm -top-px' : 'top-1/2 -translate-y-1/2'}`}>
                                Add login +
                            </span>
                            <input
                                onChange={(e) => {
                                    setForm({ ...form, password: e.target.value });
                                    setError("");
                                }}
                                required
                                placeholder="Add login"
                                value={form.password}
                                className={`px-1 outline-none text-text_color focus:border-border_active text-sm w-full bg-transparent disabled:cursor-not-allowed placeholder:text-text_color/0 placeholder-shown:mt-0 mt-4`}
                                disabled={switchingAccount || accounts.length >= 10}
                            />
                        </label>
                        <button
                            type='submit'
                            className="py-1 disabled:opacity-50"
                            disabled={switchingAccount || accounts.length >= 10}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="auto" height="full" viewBox="0 0 32 32" version="1.1">
                                <path d="M7.744 19.189l-1.656 5.797c-0.019 0.062-0.029 0.133-0.029 0.207 0 0.413 0.335 0.748 0.748 0.748 0.001 0 0.001 0 0.002 0h-0c0.001 0 0.002 0 0.003 0 0.075 0 0.146-0.011 0.214-0.033l-0.005 0.001 5.622-1.656c0.124-0.037 0.23-0.101 0.315-0.186l-0 0 17.569-17.394c0.137-0.135 0.223-0.323 0.223-0.531v-0c0-0 0-0.001 0-0.001 0-0.207-0.084-0.395-0.219-0.531l-4.141-4.142c-0.136-0.136-0.324-0.22-0.531-0.22s-0.395 0.084-0.531 0.22v0l-17.394 17.394c-0.088 0.088-0.153 0.198-0.189 0.321l-0.001 0.005zM25.859 3.061l3.078 3.078-3.078 3.047-3.079-3.047zM21.72 7.2l3.073 3.041-12.756 12.628-4.133 1.217 1.229-4.299zM30 13.25c-0.414 0-0.75 0.336-0.75 0.75v0 15.25h-26.5v-26.5h15.25c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-16c-0.414 0-0.75 0.336-0.75 0.75v0 28c0 0.414 0.336 0.75 0.75 0.75h28c0.414-0 0.75-0.336 0.75-0.75v0-16c-0-0.414-0.336-0.75-0.75-0.75v0z" />
                            </svg>
                        </button>
                    </div>
                    {error && <p className='text-text_color text-sm pl-1 pt-1'>{error}</p>}
                    {accounts.length >= 10 && (
                        <p className='text-text_color text-sm pl-1 pt-1'>
                            You have reached the maximum number of accounts (10).
                        </p>
                    )}
                </form>
            </div>
        </>
    )
}

export default SwitchLoginList;