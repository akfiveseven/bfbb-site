import React from 'react';

interface CenteredContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CenteredContainer: React.FC<CenteredContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <main 
      className={`
        w-full 
        mx-auto 
        px-4 
        sm:px-6 
        lg:px-8
        min-h-[calc(100vh-6rem)] 
        flex 
        flex-col 
        justify-center 
        items-center 
        ${className}
      `}
    >
      {children}
    </main>
  );
}; 