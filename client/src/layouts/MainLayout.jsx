import React from 'react';
import FloatingDock from '../components/FloatingDock';

/**
 * MainLayout component - Simple wrapper to integrate FloatingDock with existing routing
 * 
 * This layout wrapper can be used to add the floating dock to your entire application
 * without modifying existing route components or the main App.jsx file.
 * 
 * Usage:
 * 1. Wrap your Routes component with MainLayout
 * 2. The floating dock will automatically appear on all pages
 * 3. Maintains existing routing structure and functionality
 */
const MainLayout = ({ children }) => {
  return (
    <div className="relative">
      {/* Render all existing content (NavBar, Routes, Footer) */}
      {children}
      
      {/* Add floating dock overlay */}
      <FloatingDock />
    </div>
  );
};

export default MainLayout;