import { useState } from 'react';
import ReactDom from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import Radio from '@/components/RadioButton';

export interface AccountDetail {
    authId: string;
    name: string | null;
}

interface ChoosePopupProps {
    showPopup: boolean;
    setShowPopup: (show: boolean) => void;
    data: AccountDetail[] | undefined;
    onSwitchSuccess?: () => void;
}

export const ChoosePopup = ({
    showPopup,
    setShowPopup,
    data,
    onSwitchSuccess
}: ChoosePopupProps) => {
    const accounts: AccountDetail[] = data || [];
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [switchingAccount, setSwitchingAccount] = useState<boolean>(false);
    const { storeLoginValues } = useAuth();
    const toast = useToast();

    const handleSwitchAccount = async (account: AccountDetail) => {
        if (switchingAccount) {
            return;
        }

        try {
            setSelectedId(account.authId);
            setSwitchingAccount(true);
            const res = await fetch("/api/auth/switchLogin", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ account: account.authId }),
            });

            const data = await res.json();
            if (data.newtoken) {
                storeLoginValues(data.newtoken, data.userType, data.authId);
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
                className={`lg:pl-40 lg:mt-12 absolute max-w-[2600px] mx-auto inset-0 transition-all duration-500 ease-in-out backdrop-blur-sm 
                    ${showPopup ? 'bg-gray-500/60 top-0' : 'bottom-full delay-[600ms]'}`}
            />
            <div className="lg:pl-40 w-full h-full max-w-[2600px] mx-auto relative z-20 pointer-events-none">
                <div className={`md:w-full md:h-full fixed top-full left-0 right-0 md:static md:flex md:flex-col md:justify-center md:items-center transition-all duration-500 ease-in-out
                    ${showPopup ? '-translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden slidpanel-hide'}`}>
                    <div className={`
                        w-full max-h-[80vh] md:max-h-[90%] text-text_color overflow-y-auto cursor-default
                        md:max-w-[95%] lg:max-w-[450px] mx-auto bg-main_background overflow-x-hidden 
                        rounded-t-md md:rounded-lg text-left md:shadow-xl p-6 pointer-events-auto
                        ${showPopup ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}
                    `}>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold">
                                {switchingAccount ? "Switching..." : "Select Account"}
                            </h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-text_color/60 hover:text-text_color transition-colors"
                                disabled={switchingAccount}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            {accounts.length > 0 ? (
                                accounts.map((account) => (
                                    <div
                                        key={account.authId}
                                        className={`flex items-center p-3 rounded-md border transition-all duration-200 ${account.authId === selectedId
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
