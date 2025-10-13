'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import { FaRobot } from 'react-icons/fa';

import Container from './Container';
import { siteDetails } from '@/data/siteDetails';
import { menuItems } from '@/data/menuItems';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-transparent fixed top-0 left-0 right-0 z-50 w-full">
      <Container className="!px-0">
        <nav className="shadow-md md:shadow-none bg-white md:bg-transparent flex justify-between items-center py-2 px-5 md:py-8">
          <Link href="/" className="flex items-center gap-2">
            <FaRobot className="text-foreground w-6 h-6" />
            <span className="text-xl font-semibold text-foreground cursor-pointer">
              {siteDetails.siteName}
            </span>
          </Link>

          <ul className="hidden md:flex space-x-6">
            {menuItems.map(item => (
              <li key={item.text}>
                <Link href={item.url} className="text-foreground hover:text-foreground-accent transition-colors">
                  {item.text}
                </Link>
              </li>
            ))}
            <li>
              <Link href="#cta" className="text-white bg-black hover:bg-neutral-800 px-6 py-2 rounded-full transition-colors">
                Start Now
              </Link>
            </li>
          </ul>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center">
              {isOpen ? <HiOutlineXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
              <span className="sr-only">Toggle navigation</span>
            </button>
          </div>
        </nav>
      </Container>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-4 pt-4 pb-6 px-6">
            {menuItems.map(item => (
              <li key={item.text}>
                <Link href={item.url} className="text-foreground hover:text-primary block" onClick={toggleMenu}>
                  {item.text}
                </Link>
              </li>
            ))}
            <li>
              <Link href="#cta" className="text-white bg-black px-5 py-2 rounded-full block w-fit" onClick={toggleMenu}>
                Start Now
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </header>
  );
};

export default Header;

