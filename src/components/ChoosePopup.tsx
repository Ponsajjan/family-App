import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import Radio from '@/components/RadioButton';
import { useSWRConfig } from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from '@/store';
import { selectChoosePopupAccounts, ChoosePopupAccount } from '@/store/slices/termsSlice';
import { setCurrentAuthId, setMainMemberName, setIsModerator, setSwitchingAccount, fetchTermsData } from '@/store/slices/termsSlice';
import { appFetch } from "@/utils/appFetch";
import PopupModal from './PopupModal';

interface ChoosePopupProps {
    setShowPopup: (show: boolean) => void;
    onSwitchSuccess?: () => void;
    showWarning?: boolean;
}

export const ChoosePopup = ({
    setShowPopup,
    onSwitchSuccess,
    showWarning = false
}: ChoosePopupProps) => {
    const reduxAccounts = useSelector(selectChoosePopupAccounts);
    const accounts: ChoosePopupAccount[] = reduxAccounts;
    const currentAuthId = useSelector((state: RootState) => state.terms.currentAuthId);
    // Lives in Redux, not component state: ChoosePopup is conditionally
    // mounted ({showChoosePopup && <ChoosePopup/>}), so a ref/useState guard
    // here would reset the moment the popup closes and reopens, even while
    // the previous switch's background fetchTermsData() is still pending.
    const switchingAccount = useSelector((state: RootState) => state.terms.switchingAccount);
    const [selectedId, setSelectedId] = useState<string | null>(currentAuthId || null);
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
        // Read the live store value, not the `switchingAccount` selector
        // result above — that's frozen to this render's closure, which
        // wouldn't reliably block a second invocation arriving before React
        // re-renders (e.g. two rapid real clicks).
        if (store.getState().terms.switchingAccount) {
            return;
        }

        if (String(account.authId) === String(currentAuthId)) {
            setShowPopup(false);
            return;
        }

        dispatch(setSwitchingAccount(true));
        try {
            setSelectedId(account.authId);
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
                dispatch(setIsModerator(data.userType === 'Moderator'));
                dispatch(setSwitchingAccount(false));
                clearFamilyCache();
                onSwitchSuccess?.();
                setShowPopup(false);
            } else {
                toast?.show(data.error || "An unexpected error occurred.", "error", 5000);
                setSelectedId(null);
                dispatch(setSwitchingAccount(false));
            }
        } catch (error: any) {
            toast?.show(error.message || "An unexpected error occurred.", "error", 5000);
            setSelectedId(null);
            dispatch(setSwitchingAccount(false));
        }
    };

    return (
        <PopupModal title={switchingAccount ? "Switching..." : "Select Account"} onClose={() => setShowPopup(false)}>
            <div className="space-y-3">
                {accounts.length > 1 ? (
                    accounts.map((account) => (
                        <div
                            key={account.authId}
                            className={`flex items-center rounded-md border transition-all duration-200 relative ${account.authId === selectedId
                                ? 'bg-field_color border-border_active'
                                : 'border-border_color md:hover:bg-field_hover cursor-pointer'
                                }`}
                        >
                            <Radio
                                checked={selectedId === account.authId}
                                readOnly={true}
                                disabled={switchingAccount}
                                label={account.name || 'Anonymous Account'}
                                className="w-full !justify-start p-3"
                                onClick={() => handleSwitchAccount(account)}
                            />
                            {showWarning && account.hasChanges && (
                                <span className="relative flex justify-center items-center h-2.5 w-2.5 mr-3">
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
        </PopupModal>
    )
}
