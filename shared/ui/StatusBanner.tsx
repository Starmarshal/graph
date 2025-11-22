import React, {ComponentPropsWithoutRef} from 'react';

type StatusBanner = {
  children: React.ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

const StatusBanner: React.FC<StatusBanner> = ({
                                                children,
                                                className = '',
                                                ...props
                                              }) => {
  return (
    <div className={`
      mt-2 p-2 rounded-lg
      border text-sm 
      text-center h-[41px] flex items-center justify-center
      ${className}
      `.trim()}
         {...props}
    >
      {children}
    </div>
  );
};

export default StatusBanner;