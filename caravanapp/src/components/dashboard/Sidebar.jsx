import React from "react";
import {
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  HomeIcon,
  TruckIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ activeView, setActiveView }) => {
  const navLinks = [
    { name: "Overview", icon: HomeIcon },
    { name: "Reservations", icon: DocumentTextIcon },
    { name: "My Caravans", icon: TruckIcon },
    { name: "Messaging", icon: ChatBubbleLeftEllipsisIcon },
    { name: "Maintenance Log", icon: ChartBarIcon },
    { name: "Settings", icon: CogIcon },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 space-y-2">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(link.name);
            }}
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
              activeView === link.name ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <link.icon className="w-6 h-6 mr-3" />
            {link.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
