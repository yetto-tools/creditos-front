import React from 'react';

export default function Card({ children, className = '', title, icon: Icon }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center space-x-3 mb-4">
          {Icon && <Icon className="text-teal-600" size={24} />}
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
}