import { format } from 'date-fns';

// Relatives Member Details Components
export const InformationSection = ({
  title,
  children
}: {
  title: string,
  children: React.ReactNode
}) => (
  <>
    <div className="flex pt-4 pb-1.5 items-center">
      <p className="font-semibold pr-2 md:pr-4 whitespace-nowrap">{title}</p>
      <p className="border-t border-border_color w-full" aria-hidden="true"></p>
    </div>
    <div className="pl-1">
      <div className="flex flex-wrap border-l border-border_color pl-2">
        {children}
      </div>
    </div>
  </>
);

export const DateInfo = ({ prefix, date, month, year, fallback }: any) => {
  if (!month && !year) return fallback ? <p className="text-sm">{fallback}</p> : null;

  return (
    <div className='flex items-baseline gap-1 text-sm'>
      <p>{prefix} :</p>
      <p>
        {date && `${date} `}
        {month && format(`${month}`, 'MMM')}
        {year && ` ${year}`}
      </p>
    </div>
  );
};

export const MemberItem = ({ label, value, isList = false }: {
  label?: string,
  value: string | { name: string }[],
  isList?: boolean
}) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  return (
    <>
      {label && <div className="w-2/5 md:leading-7 font-medium mb-0.5">
        <div className="flex">
          <span className='whitespace-nowrap'>{label}</span>
          <span className="border-b border-dotted border-border_color w-full mb-2 mx-2" aria-hidden="true"></span>
        </div>
      </div>}
      <div className={`${label ? 'w-3/5' : 'w-full'} md:leading-7 flex flex-wrap mb-0.5`}>
        {isList && Array.isArray(value) ? (
          value.map((item, index) => (
            <span key={index}>
              {item.name}
              {index < value.length - 1 && ','}&nbsp;
            </span>
          ))
        ) : (
          value as string
        )}
      </div>
    </>
  );
};

// Verify Member Details Components
export const MemberItemVerify = ({
  label,
  name,
  isVerified,
  onClick,
  isCustom = false
}: {
  label: string;
  name: string;
  isVerified?: boolean;
  onClick?: () => void;
  isCustom?: boolean;
}) => (
  <>
    <div className='w-2/5 md:leading-7 font-medium capitalize'>
      <div className='flex'>
        <span>{label}</span>
        <span className='border-b border-dotted border-border_color w-full mb-2 mx-2' aria-hidden="true"></span>
      </div>
    </div>
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`w-3/5 md:leading-7 flex flex-wrap ${onClick ? 'hover:underline cursor-pointer' : ''
        } ${isCustom ? 'italic' : isVerified !== undefined
          ? isVerified ? 'text-text_color' : 'text-text_color/70 underline decoration-wavy'
          : ''
        }`}
      onClick={onClick}
    >
      {name}
    </div>
  </>
);

export const MemberListItemVerify = ({
  label,
  items,
  onItemClick
}: {
  label: string;
  items: Array<{ name: string; verified: boolean }>;
  onItemClick: (name: string) => void;
}) => (
  <>
    <div className='w-2/5 md:leading-7 font-medium capitalize'>
      <div className='flex'>
        <span>{label}</span>
        <span className='border-b border-dotted border-border_color w-full mb-2 mx-2' aria-hidden="true"></span>
      </div>
    </div>
    <div className='w-3/5 md:leading-7 flex flex-wrap'>
      {items.map((item, index) => (
        <span
          key={index}
          role="button"
          tabIndex={0}
          onClick={() => onItemClick(item.name)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onItemClick(item.name); } }}
          aria-label={`View ${item.name}${!item.verified ? ' (unverified)' : ''}`}
          className={`hover:underline cursor-pointer ${item.verified ? 'text-text_color' : 'text-text_color/70 underline decoration-wavy'
            }`}
        >
          {item.name}
          {index < items.length - 1 && ','}&nbsp;
        </span>
      ))}
    </div>
  </>
);

export const PhoneNumberItem = ({ value }: { value: string }) => {
  if (!value) return null;

  const numbers = value.split(',').map(num => num.trim()).filter(Boolean);
  if (numbers.length === 0) return null;

  return (
    <>
      <div className="w-2/5 md:leading-7 font-medium mb-0.5">
        <div className="flex">
          <span className='whitespace-nowrap'>Phone no.</span>
          <span className="border-b border-dotted border-border_color w-full mb-2 mx-2" aria-hidden="true"></span>
        </div>
      </div>
      <div className="w-3/5 md:leading-7 flex flex-wrap mb-0.5">
        {numbers.map((num, idx) => (
          <a href={`tel:${num}`} className='cursor-pointer' key={idx} aria-label={`Call ${num}`}>
            {num}{idx < numbers.length - 1 && <span className="mr-1" aria-hidden="true">,</span>}
          </a>
        ))}
      </div>
    </>
  );
};
