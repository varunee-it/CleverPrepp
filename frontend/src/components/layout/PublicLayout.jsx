import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../pages/Landing/components/Navbar';
import Footer from '../../pages/Landing/components/Footer';

const PublicLayout = () => {
  const [globalTheme, setGlobalTheme] = useState(() => localStorage.getItem("cleverprep_global_theme") || "white");

  useEffect(() => {
    const handleThemeChange = () => {
      setGlobalTheme(localStorage.getItem("cleverprep_global_theme") || "white");
    };
    window.addEventListener("cleverprep-global-theme-changed", handleThemeChange);
    return () => window.removeEventListener("cleverprep-global-theme-changed", handleThemeChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", globalTheme);
  }, [globalTheme]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary transition-colors duration-300 font-display overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
