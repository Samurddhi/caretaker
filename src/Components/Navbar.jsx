import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname || '/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: '/home', label: 'Home' },
    { id: '/health-tracking', label: 'Health Tracking' },
    { id: '/diet-plan', label: 'Diet Plan' },
    { id: '/appointments', label: 'Appointments' },
    { id: '/profile', label: 'Profile' },
  ];

  // Update active tab on route change
  React.useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsMobileMenu(false); // Close mobile menu when an item is clicked
  };

  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-pink-500 to-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="ml-6 text-3xl font-bold text-red-600 flex items-center">
              Care<span className="text-gray-600 relative flex items-center">
                taker
                <span className="ml-1 text-red-500 text-4xl font-bold animate-pulse">+</span>
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform ${
                  activeTab === item.id
                    ? 'bg-yellow-400 text-black shadow-lg scale-105'
                    : 'text-white hover:bg-pink-500 hover:text-black hover:scale-105'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mr-4">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-pink-500 hover:text-black rounded-lg transition-all duration-300"
            >
              <svg 
                className="h-7 w-7" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-95 rounded-lg mx-4 mt-2 shadow-xl animate-slideDown">
            <div className="px-3 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === item.id
                      ? 'bg-yellow-400 text-black shadow-lg'
                      : 'text-white hover:bg-pink-500 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;