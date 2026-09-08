import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import TourOverlay from "../tour/TourOverlay";
import MinimizedFocusChip from "../focus/MinimizedFocusChip";

// ==========================================
// Main App Layout
// ==========================================
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isFocusPage = location.pathname.startsWith("/focus");

  // ==========================================
  // Sidebar States
  // ==========================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previousSidebarState, setPreviousSidebarState] = useState(null);

  // Auto-collapse sidebar in Focus Mode
  useEffect(() => {
    if (isFocusPage) {
      setIsSidebarCollapsed((currentSidebarState) => {
        // Save the current state before collapsing
        setPreviousSidebarState(currentSidebarState);
        return true; // Force collapse
      });
    } else {
      setPreviousSidebarState((savedState) => {
        if (savedState !== null) {
          setIsSidebarCollapsed(savedState);
        }
        return null; // Clear saved state
      });
    }
  }, [isFocusPage]);

  // ==========================================
  // Focus Workspace Global Theme Selector State
  // ==========================================
  const [globalTheme, setGlobalTheme] = useState(() => localStorage.getItem("cleverprep_global_theme") || "white");

  useEffect(() => {
    const handleThemeChange = () => {
      setGlobalTheme(localStorage.getItem("cleverprep_global_theme") || "white");
    };
    window.addEventListener("cleverprep-global-theme-changed", handleThemeChange);
    return () => window.removeEventListener("cleverprep-global-theme-changed", handleThemeChange);
  }, []);

  // Write theme dynamically to documentElement so all pages/elements inherit it
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", globalTheme);
  }, [globalTheme]);

  // ==========================================
  // Toggle Handlers
  // ==========================================
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDesktopSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden font-display transition-colors duration-300 bg-bg-base text-text-primary">
      {/* Sidebar - Positioned adjacent to content */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden relative">
        <Header 
          toggleMobileMenu={toggleMobileMenu} 
          toggleDesktopSidebar={toggleDesktopSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto transition-colors duration-300 bg-bg-base">
          <div className="w-full max-w-[1440px] mx-auto px-6 py-6 lg:px-8 lg:py-8 transition-all duration-300 ease-in-out">
            {children}
          </div>
        </main>
      </div>
      
      <TourOverlay />
      <MinimizedFocusChip />
    </div>
  );
};

export default AppLayout;