import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Home, TrendingUp, Banknote, Users } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/', icon: Home },
    { label: 'Inversiones', href: '/inversiones', icon: TrendingUp },
    { label: 'Préstamos', href: '/prestamos', icon: Banknote },
    { label: 'Usuarios', href: '/usuarios', icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold">B</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Banco API</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition flex items-center space-x-1"
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario y Logout */}
          <div className="flex items-center space-x-4">
            <Link
              to="/perfil"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              <User size={18} />
              <span className="hidden sm:inline text-sm">{user?.nombreCompleto || 'Usuario'}</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm">Salir</span>
            </button>

            {/* Menu Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition flex items-center space-x-2"
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}