import { CallSelect } from '@/utils/Icons';
import PopupModal from './PopupModal';

interface PhoneCallPopupProps {
  numbers: string[];
  onClose: () => void;
}

export default function PhoneCallPopup({ numbers, onClose }: PhoneCallPopupProps) {
  return (
    <PopupModal title="Select Phone Number" onClose={onClose}>
      <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">
        {numbers.map((num, idx) => (
          <a
            key={idx}
            href={`tel:${num}`}
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-md border border-border_color bg-field_color hover:bg-field_hover cursor-pointer transition-all duration-200"
          >
            <div className="text-primary scale-110">
              <CallSelect />
            </div>
            <span>{num}</span>
          </a>
        ))}
      </div>
    </PopupModal>

  );
}
