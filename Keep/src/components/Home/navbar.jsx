import { useState } from "react";
import {
  Menu,
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  Settings,
  Grid3X3,
  X,
} from "lucide-react";
import GoogleKeepIcon from "./keep-icon.jsx";
import { useNotes } from "../../context/NotesContext.jsx";

const Navbar = () => {
  const {
    toggleSidebar,
    viewMode,
    toggleViewMode,
    searchQuery,
    setSearchQuery,
  } = useNotes();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 w-full bg-[#202124] border-b border-[#5f6368] px-2">
      {/* Left section - Menu and Logo */}
      <div className="flex items-center gap-1">
        {/* Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="p-3 rounded-full hover:bg-[#3c4043] transition-colors duration-200"
          aria-label="Main menu"
        >
          <Menu size={24} className="text-[#e8eaed]" />
        </button>

        {/* Keep Logo */}
        <div className="flex items-center gap-2 px-1">
          <GoogleKeepIcon size={40} />
          <span className="text-[22px] text-[#e8eaed] font-normal tracking-wide hidden sm:block">
            Keep
          </span>
        </div>
      </div>

      {/* Center section - Search Bar */}
      <div className="flex-1 max-w-[720px] mx-2 sm:mx-4 sm:ml-20">
        <div
          className={`flex items-center h-12 rounded-lg transition-all duration-200 ${
            isSearchFocused
              ? "bg-[#fff] shadow-md"
              : "bg-[#525355] hover:bg-[#636466]"
          }`}
        >
          <div className="pl-4 pr-3">
            <Search
              size={20}
              className={isSearchFocused ? "text-[#5f6368]" : "text-[#e8eaed]"}
            />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`flex-1 bg-transparent outline-none text-base h-full ${
              isSearchFocused
                ? "text-[#202124] placeholder-[#5f6368]"
                : "text-[#e8eaed] placeholder-[#e8eaed]"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`p-2 mr-1 rounded-full hover:bg-[#e8eaed] ${isSearchFocused ? "text-[#5f6368]" : "text-[#e8eaed]"}`}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Right section - Action buttons */}
      <div className="flex items-center gap-0 sm:gap-1 ml-auto">
        {/* Refresh - hidden on mobile */}
        <button
          onClick={handleRefresh}
          className="p-2 sm:p-3 rounded-full hover:bg-[#3c4043] transition-colors duration-200 hidden sm:block"
          aria-label="Refresh"
        >
          <RefreshCw size={20} className="text-[#e8eaed]" />
        </button>

        {/* Grid/List View Toggle */}
        <button
          onClick={toggleViewMode}
          className="p-3 rounded-full hover:bg-[#3c4043] transition-colors duration-200"
          aria-label={viewMode === "grid" ? "List view" : "Grid view"}
        >
          {viewMode === "grid" ? (
            <List size={20} className="text-[#e8eaed]" />
          ) : (
            <LayoutGrid size={20} className="text-[#e8eaed]" />
          )}
        </button>

        {/* Settings - hidden on mobile */}
        <button
          className="p-2 sm:p-3 rounded-full hover:bg-[#3c4043] transition-colors duration-200 hidden sm:block"
          aria-label="Settings"
        >
          <Settings size={20} className="text-[#e8eaed]" />
        </button>

        {/* Apps Grid - hidden on mobile */}
        <button
          className="p-2 sm:p-3 rounded-full hover:bg-[#3c4043] transition-colors duration-200 hidden md:block"
          aria-label="Google apps"
        >
          <Grid3X3 size={20} className="text-[#e8eaed]" />
        </button>

        {/* Profile Avatar */}
        <button
          className="ml-2 w-8 h-8 rounded-full bg-[#137333] flex items-center justify-center text-white text-sm font-medium hover:shadow-lg transition-shadow duration-200"
          aria-label="Google Account"
        >
          H
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
