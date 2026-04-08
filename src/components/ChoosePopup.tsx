import { useState } from 'react';
import ReactDom from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import Radio from '@/components/RadioButton';
import { useSWRConfig } from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { selectChoosePopupAccounts, ChoosePopupAccount } from '@/store/slices/termsSlice';
import { setCurrentAuthId, setMainMemberName, setIsModerator, fetchTermsData } from '@/store/slices/termsSlice';
import { appFetch } from "@/utils/appFetch";
import { CloseIcon } from '@/utils/Icons';

interface ChoosePopupProps {
    showPopup: boolean;
    setShowPopup: (show: boolean) => void;
    onSwitchSuccess?: () => void;
    showWarning?: boolean;
}

export const ChoosePopup = ({
    showPopup,
    setShowPopup,
    onSwitchSuccess,
    showWarning = false
}: ChoosePopupProps) => {
    const reduxAccounts = useSelector(selectChoosePopupAccounts);
    const accounts: ChoosePopupAccount[] = reduxAccounts;
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [switchingAccount, setSwitchingAccount] = useState<boolean>(false);
    const { storeLoginValues } = useAuth();
    const toast = useToast();
    const { cache, mutate: globalMutate } = useSWRConfig();
    const dispatch = useDispatch<AppDispatch>();

    const clearFamilyCache = () => {
        const allKeys = Array.from(cache.keys());
        allKeys.forEach(key => {
            if (typeof key === 'string') {
                const isApiMatch = (path: string) =>
                    path.startsWith('/api/tree') ||
                    path.startsWith('/api/moderator');

                if (isApiMatch(key) || (key.startsWith('$inf$') && isApiMatch(key.substring(5)))) {
                    globalMutate(key, undefined, { revalidate: false });
                }
            }
        });
    };

    const handleSwitchAccount = async (account: ChoosePopupAccount) => {
        if (switchingAccount) {
            return;
        }

        try {
            setSelectedId(account.authId);
            setSwitchingAccount(true);
            const res = await appFetch("/api/auth/switchLogin", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ account: account.authId }),
            });

            const data = await res.json();
            if (data.newtoken) {
                storeLoginValues(data.newtoken, data.userType, data.authId);
                dispatch(setCurrentAuthId(data.authId));
                dispatch(setMainMemberName(data.mainMemberName || 'Account'));
                // Refresh all moderator groups for selected accounts
                dispatch(fetchTermsData());
                dispatch(setIsModerator(data.userType === 'Moderator'))
                clearFamilyCache();
                onSwitchSuccess?.();
                setShowPopup(false);
            } else {
                toast?.show(data.error || "An unexpected error occurred.", "error", 5000);
                setSelectedId(null);
            }
        } catch (error: any) {
            toast?.show(error.message || "An unexpected error occurred.", "error", 5000);
            setSelectedId(null);
        } finally {
            setSwitchingAccount(false);
        }
    };

    return ReactDom.createPortal(
        <div className='fixed z-[100] inset-0 overflow-hidden'>
            <div
                onClick={() => setShowPopup(false)}
                className={`xl:pl-40 xl:mt-12 bg-gray-500/60 absolute max-w-[162.5rem] mx-auto inset-0 backdrop-blur-sm`}
            />
            <div className="xl:pl-40 w-full h-full max-w-[162.5rem] px-2 mx-auto relative z-20 pointer-events-none">
                <div className={`w-full h-full top-full left-0 right-0 static flex flex-col justify-center items-center transition-all duration-500 ease-in-out`}>
                    <div className={`
                        w-full max-h-[80vh] md:max-h-[90%] text-text_color overflow-y-auto cursor-default
                        md:max-w-[28.125rem] mx-auto bg-main_background overflow-x-hidden 
                        rounded-lg text-left md:shadow-xl p-4 md:p-6 md:pt-4 pointer-events-auto
                    `}>
                        <div className="flex justify-between items-center mb-4 border-b pb-1">
                            <h2 className="text-xl font-semibold">
                                {switchingAccount ? "Switching..." : "Select Account"}
                            </h2>
                            <div onClick={() => setShowPopup(false)} className='border border-border_color rounded-md m-2 cursor-pointer'>
                                <CloseIcon />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {accounts.length > 0 ? (
                                accounts.map((account) => (
                                    <div
                                        key={account.authId}
                                        className={`flex items-center p-3 rounded-md border transition-all duration-200 relative ${account.authId === selectedId
                                            ? 'bg-field_color border-border_active'
                                            : 'border-border_color hover:bg-field_hover cursor-pointer'
                                            }`}
                                        onClick={() => handleSwitchAccount(account)}
                                    >
                                        <Radio
                                            checked={selectedId === account.authId}
                                            readOnly={true}
                                            disabled={switchingAccount}
                                            label={account.name || 'Anonymous Account'}
                                            className="w-full !justify-start"
                                        />
                                        {showWarning && account.hasChanges && (
                                            <span className="relative flex justify-center items-center h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                                                <span className="absolute inline-flex rounded-full h-2.5 w-2.5 bg-black shadow-[0_0_8px_rgba(0,0,0,0.6)]"></span>
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">No other accounts found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('portal') as HTMLElement
    )
}
