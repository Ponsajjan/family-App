import { CloseIcon } from '@/utils/Icons';
import { useState } from 'react'

const DropArea = () => {
  const [showDropArea, setShowDropArea] = useState(false);
  
  return (
    <div 
      onDragEnter={() => setShowDropArea(true)}
      onDragLeave={() => setShowDropArea(false)}
      className={`${showDropArea ? 'w-full h-14 ease-in-out' : 'opacity-0'} py-1`}
    ></div>
  )
}

export default DropArea
