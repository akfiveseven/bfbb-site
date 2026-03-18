"use client";

import React, { useState, useContext, createContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define the type for the context
interface MenuContextType {
  isOpen: boolean;
  toggleMenu: () => void;
}

// Create context with a default value
const MenuContext = createContext<MenuContextType | undefined>(undefined);

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <MenuContext.Provider value={{ isOpen, toggleMenu }}>
      <nav className='
          bg-[#010054] 
          text-white 
          flex 
          p-[1rem] 
          py-[2.25rem]
          items-center 
          overflow-hidden 
          sticky 
          top-0 
          h-[4rem] 
          w-full 
          justify-between 
          z-10
        '
      >
        <Image 
          src="/img/bfbb-community-logo.png"
          alt="BFBB Community Logo"
          width={128}
          height={128}
          className='align-middle max-h-16'
        />

        <div className='hidden md:block font-bob items-center justify-center'>
          <NavLink label='Home' route='/' />
          <NavLink label='Speedrunning' route='/speedrun' />
          {/* <button className='ml-4 text-center font-bob text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg px-5 py-2.5 focus:outline-none'>Login</button> */}
        </div>

        <MenuToggle />
      </nav>

      <MenuItems />
    </MenuContext.Provider>
  )
};

// Define the props type for NavLink
interface NavLinkProps {
  label: string;
  route: string;
}

const NavLink = ({ label, route }: NavLinkProps) => {
  return (
    <Link href={route}>
      <p className={`
          text-center 
          py-3 
          md:!py-0 
          md:!text-start 
          md:!px-4 
          md:!inline 
          cursor-pointer
        `}
      >
        {label}
      </p>
    </Link>
  );
};

const MenuToggle = () => {
  // Use a custom hook to safely access context
  const context = useContext(MenuContext);
  
  if (!context) {
    throw new Error('MenuToggle must be used within a MenuContext Provider');
  }

  const { toggleMenu } = context;

  return (
    <div
      className='md:hidden bg-transparent border-none text-white text-[1.5rem] cursor-pointer'
      onClick={toggleMenu}>
      <svg
        className='w-[2rem] h-[2rem]'
        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="6" r="2" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="18" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};

const MenuItems = () => {
  // Use a custom hook to safely access context
  const context = useContext(MenuContext);
  
  if (!context) {
    throw new Error('MenuItems must be used within a MenuContext Provider');
  }

  const { isOpen } = context;

  return (
    <div className={`
        font-bob 
        text-white 
        transition-all 
        duration-300 
        ease-in-out 
        ${isOpen ?
        'block md:!hidden !bg-[#010035] sticky md:!flex !max-h-screen !opacity-100' :
        'block !md:hidden !max-h-0 !opacity-0 pointer-events-none'
      }
      `}
    >
      <hr className='border-t border-solid border-[#30303D]' />
      <NavLink label='Home' route='/' />
      <hr className='border-t border-solid border-[#30303D]' />
      <NavLink label='Speedrunning' route='/speedrun' />
      <hr className='border-t border-solid border-[#30303D]' />
    </div>
  );
};

export { Topbar }