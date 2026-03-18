import React from 'react';

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
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
        min-h-[calc(100vh-6rem)] 
        lg:px-8
        py-6
        pt-8
        ${className}
      `}
    >
      {children}
    </main>
  );
}; 