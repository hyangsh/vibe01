import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const Header = () => (
  <header className="bg-white shadow-sm p-4 flex justify-end items-center">
    <div className="flex items-center space-x-4">
      <div className="relative">
        <BellIcon className="w-6 h-6 text-gray-500" />
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
      </div>
      <UserCircleIcon className="w-8 h-8 text-gray-500" />
    </div>
  </header>
);

export default Header;
