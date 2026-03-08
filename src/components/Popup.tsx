import ReactDom from 'react-dom'

interface PopupProps {
  children?: React.ReactNode;
}

export const Popup = ({children} : PopupProps) => {
  return ReactDom.createPortal(
    <div className="absolute flex flex-col justify-center items-center z-50 inset-0 bg-gray-400 bg-opacity-50">
      <div className={`w-full max-h-[90%] text-text_color overflow-y-auto cursor-default z-40 max-w-[95%] md:max-w-[43.75rem] mx-auto bg-main_background overflow-x-hidden rounded-lg text-left shadow-xl p-4`}>
        {children}
      </div>
    </div>,
    document.getElementById('portal') as HTMLElement
  )
}