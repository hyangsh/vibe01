import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { to: '/caravans', text: 'Caravans' },
    { to: '/create-caravan', text: 'Create Caravan' },
    { to: '/reservations', text: 'My Reservations' },
    { to: '/host-dashboard', text: 'Host Dashboard' },
    { to: '/users/60d5f3f7a3b7a82b5c8d3d8e', text: 'Profile' },
    { to: '/login', text: 'Login' },
    { to: '/register', text: 'Register' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          <Link to="/">CaravanShare</Link>
        </h1>
        <button
          onClick={toggleDrawer}
          className="text-gray-800 focus:outline-none z-30"
          aria-label="Open navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleDrawer}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-20 transition-transform duration-300 ease-in-out w-full sm:w-80 md:w-96 ${
          isOpen ? 'transform translate-x-0' : 'transform translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleDrawer}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Close navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <ul className="flex flex-col items-start p-4">
          {navLinks.map((link) => (
            <li key={link.to} className="w-full">
              <Link
                to={link.to}
                onClick={toggleDrawer}
                className="block py-3 px-4 text-lg text-gray-700 hover:bg-gray-100 rounded-md w-full"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
