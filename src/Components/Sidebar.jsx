import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { BiGridAlt } from 'react-icons/bi';
import { HiOutlineDocumentText, HiOutlineNewspaper } from 'react-icons/hi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <BiGridAlt className="text-xl" /> },
    { to: "/news", label: "Add News", icon: <HiOutlineDocumentText className="text-xl" /> },
    { to: "/blogs", label: "Add Blogs", icon: <HiOutlineNewspaper className="text-xl" /> },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#12294A] text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:block`}
      >
        
        <div className="flex justify-end p-4 lg:hidden">
          <FaTimes className="text-white text-2xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        <h1 className="text-[#E60023] font-marathi text-4xl px-10 pt-4 lg:pt-16">शुभ प्रभात</h1>

        <ul className="mt-6 space-y-3 p-6">
          {navItems.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`p-3 rounded flex items-center gap-2 transition 
                ${location.pathname === to ? 'bg-[#1E3A5F]' : 'hover:bg-[#1E3A5F]'}`}
                onClick={toggleSidebar}
              >
                {icon} {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
