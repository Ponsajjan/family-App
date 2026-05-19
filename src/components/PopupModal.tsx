import { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { CloseIcon } from '@/utils/Icons';

interface PopupModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function PopupModal({ title, onClose, children }: PopupModalProps) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalNode(document.getElementById('portal') as HTMLElement);
  }, []);

  if (!portalNode) return null;

  return ReactDom.createPortal(
    <div className='fixed z-[110] inset-0 overflow-hidden'>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="xl:pl-40 xl:mt-12 bg-gray-500/60 absolute max-w-[162.5rem] mx-auto inset-0 backdrop-blur-sm"
      />
      {/* Centred card */}
      <div className="xl:pl-40 w-full h-full max-w-[162.5rem] px-2 mx-auto relative z-20 pointer-events-none">
        <div className="w-full h-full static flex flex-col justify-center items-center transition-all duration-500 ease-in-out">
          <div className="w-full max-h-[80vh] md:max-h-[70%] text-text_color overflow-hidden cursor-default md:max-w-[28.125rem] mx-auto bg-main_background rounded-lg text-left shadow-xl p-4 md:px-6 md:py-4 pointer-events-auto flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-border_color pb-1">
              <h2 className="text-xl font-semibold">{title}</h2>
              <div onClick={onClose} className="border border-border_color hover:bg-field_color rounded-md m-2 cursor-pointer">
                <CloseIcon />
              </div>
            </div>
            {/* Content */}
            {children}
          </div>
        </div>
      </div>
    </div>,
    portalNode
  );
}
