import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdLightbulbOutline } from "react-icons/md";
import { Bell, Pencil, Archive, Trash2, Share2, GitBranch } from "lucide-react";
import { useNotes } from "../../context/NotesContext.jsx";

const Sidebar = () => {
  const { sidebarOpen } = useNotes();
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const isExpanded = sidebarOpen || isHovered;

  const menuItems = [
    { path: "/", icon: MdLightbulbOutline, label: "Notes" },
    { path: "/reminders", icon: Bell, label: "Reminders" },
  ];

  const organizationItems = [
    {
      path: "/graph",
      icon: Share2,
      label: "Knowledge Map",
      color: "text-blue-400",
    },
    {
      path: "/backlinks",
      icon: GitBranch,
      label: "Linked Notes",
      color: "text-green-400",
    },
    { path: "/edit-labels", icon: Pencil, label: "Edit labels" },
  ];

  const systemItems = [
    { path: "/archive", icon: Archive, label: "Archive" },
    { path: "/trash", icon: Trash2, label: "Bin" },
  ];

  const renderLink = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={`flex items-center h-12 mb-1 transition-all duration-300 ease-in-out group relative ml-[14px] ${
          isExpanded ? "w-[92%] rounded-r-full" : "w-12 rounded-full"
        } ${isActive ? "bg-[#41331c]" : "hover:bg-[#28292c]"}`}
      >
        <div className="flex items-center justify-center w-12 h-12 shrink-0">
          <Icon
            size={24}
            className={`transition-colors duration-200 ${
              item.color && isActive
                ? item.color
                : isActive
                  ? "text-[#feefc3]"
                  : "text-[#9aa0a6]"
            }`}
          />
        </div>
        <span
          className={`ml-5 text-[14px] font-medium tracking-wide text-[#e8eaed] whitespace-nowrap transition-all duration-300 ${
            isExpanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4 pointer-events-none"
          }`}
        >
          {item.label}
        </span>
      </NavLink>
    );
  };

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-[#202124] transition-all duration-300 ease-in-out z-40 ${
        isExpanded ? "w-[280px] shadow-2xl" : "w-[80px] hidden md:block"
      } ${sidebarOpen ? "" : "md:block"}`}
    >
      <nav className="pt-2">
        {menuItems.map(renderLink)}

        <div
          className={`my-2 border-t border-[#5f6368] transition-all duration-300 ${isExpanded ? "mx-4" : "mx-8"}`}
        />

        {isExpanded && (
          <p className="ml-8 mt-2 mb-1 text-[11px] font-bold text-[#9aa0a6] uppercase tracking-widest">
            Organization
          </p>
        )}
        {organizationItems.map(renderLink)}

        <div
          className={`my-2 border-t border-[#5f6368] transition-all duration-300 ${isExpanded ? "mx-4" : "mx-8"}`}
        />

        {systemItems.map(renderLink)}
      </nav>

      <div
        className={`absolute bottom-6 left-8 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
      >
        <a
          href="#"
          className="text-[11px] text-[#9aa0a6] hover:underline whitespace-nowrap"
        >
          Open-source licences
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
