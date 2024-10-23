import ReactDom from 'react-dom'

interface PopupProps {
  children?: React.ReactNode;
  maxWidth?: string;
  closePopup: (open: boolean) => void;
}

export const Popup = ({children, closePopup} : PopupProps) => {
  return ReactDom.createPortal(
    <div onClick={() => closePopup(false)} className="fixed flex flex-col justify-center items-center z-50 h-screen inset-0 bg-gray-500 bg-opacity-75">
      <div className={`w-full max-h-[90%] text-text_color overflow-y-auto cursor-default z-40 max-w-[95%] md:max-w-[700px] mx-auto bg-main_background overflow-x-hidden rounded-lg text-left shadow-xl p-4`}>
        {children}
      </div>
    </div>,
    document.getElementById('portal') as HTMLElement
  )
}