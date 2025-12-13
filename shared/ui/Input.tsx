import React, {ComponentPropsWithoutRef} from 'react';

type InputProps = {
  className?: string;
} & ComponentPropsWithoutRef<'input'>;

const Input: React.FC<InputProps> = ({
                                       className = '',
                                       ...props
                                     }) => {
  return (
    <input
      className={`
          border
          rounded-md text-sm transition-all duration-200
          ease-in-out h-[41px] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder:text-gray-400 px-[10px] py-[12px]
        ${className}
      `.trim()}
      {...props}
    />
  );
};

export default Input;