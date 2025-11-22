import React, {ComponentPropsWithoutRef} from 'react';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<'button'>;

const Button: React.FC<ButtonProps> = ({
                                         children,
                                         className = '',
                                         ...props
                                       }) => {
  return (
    <button
      className={`
        border-none rounded-md text-white 
        font-medium text-sm cursor-pointer transition-all duration-200 
        ease-in-out flex-1  focus:outline-none 
        focus:ring-2  focus:ring-opacity-50 h-[41px]
        px-[10px] py-[12px] items-center justify-center flex
        transform hover:-translate-y-0.5
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;