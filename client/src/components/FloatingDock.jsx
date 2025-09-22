import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FloatingDock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mouseX = useMotionValue(Infinity);
  const { user, token } = useAuth(); // Get both user AND token
  
  // Add a local state to force re-render on auth changes
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if we're on a chat page to adjust positioning
  const isOnChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/');

  // Update authentication state whenever user or token changes
  useEffect(() => {
    const authStatus = !!(user && token);
    setIsAuthenticated(authStatus);
  }, [user, token]);

  // Auth check function for protected routes
  const checkAuthAndNavigate = (href, title) => {
    if (!isAuthenticated) {
      toast.error(`Please log in to access ${title}`, {
        icon: '🔒',
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  // Navigation items configuration
  const navItems = [
    {
      title: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024" strokeWidth={0} fill="currentColor" stroke="currentColor" className="h-full w-full">
          <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
        </svg>
      ),
      href: '/',
      type: 'link',
      requiresAuth: false
    },
    {
      title: 'Back',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full w-full">
          <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
        </svg>
      ),
      href: '#',
      type: 'action',
      action: () => navigate(-1),
      requiresAuth: false
    },
    {
      title: 'Chat',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      href: '/chat',
      type: 'link',
      requiresAuth: true
    },
    {
      title: 'Wishlist',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      href: '/wishlist',
      type: 'link',
      requiresAuth: true
    }
  ];

  // Check if current path matches item path
  const isActive = (href) => {
    if (!href || href === '#') return false;
    return location.pathname === href || 
           (href === '/' && location.pathname === '/') ||
           (href !== '/' && location.pathname.startsWith(href));
  };

  return (
    <div className={`fixed left-1/2 transform -translate-x-1/2 z-[9999] ${
      isOnChatPage ? 'bottom-4' : 'bottom-8'
    }`}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-12 items-center gap-4 rounded-2xl px-4 py-2 shadow-2xl border backdrop-blur-xl"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderColor: 'rgba(99, 102, 241, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1)'
        }}
      >
        {navItems.map((item, index) => (
          <IconContainer
            key={`${item.title}-${isAuthenticated}`} // Force re-render on auth change
            mouseX={mouseX}
            title={item.title}
            icon={item.icon}
            href={item.href}
            type={item.type}
            action={item.action}
            isActive={isActive(item.href)}
            requiresAuth={item.requiresAuth}
            checkAuthAndNavigate={checkAuthAndNavigate}
            isAuthenticated={isAuthenticated} // Pass authentication status
          />
        ))}
      </motion.div>
    </div>
  );
};

function IconContainer({ 
  mouseX, 
  title, 
  icon, 
  href, 
  type, 
  action, 
  isActive, 
  requiresAuth = false, 
  checkAuthAndNavigate,
  isAuthenticated // Use isAuthenticated instead of user
}) {
  const ref = useRef(null);
  const navigate = useNavigate();

  // Animation values
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { 
    mass: 0.1, 
    stiffness: 200, 
    damping: 15 
  });

  const heightSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const height = useSpring(heightSync, { 
    mass: 0.1, 
    stiffness: 200, 
    damping: 15 
  });

  const ySync = useTransform(distance, [-150, 0, 150], [0, -8, 0]);
  const y = useSpring(ySync, { 
    mass: 0.1, 
    stiffness: 200, 
    damping: 15 
  });

  // Handle clicks with auth check
  const handleClick = (e) => {
    if (type === 'action' && action) {
      e.preventDefault();
      action();
      return;
    }

    // Check if this route requires authentication
    if (requiresAuth && !checkAuthAndNavigate(href, title)) {
      e.preventDefault();
      return;
    }
  };

  // Handle link clicks with auth check
  const handleLinkClick = (e) => {
    if (requiresAuth && !checkAuthAndNavigate(href, title)) {
      e.preventDefault();
      return;
    }
  };

  // Visual indicator for protected routes when not authenticated
  const isProtectedAndUnauthenticated = requiresAuth && !isAuthenticated;
  const content = (
    <motion.div
      ref={ref}
      style={{ 
        width, 
        height,
        y
      }}
      className="aspect-square rounded-full backdrop-blur-sm flex items-center justify-center relative cursor-pointer transition-colors duration-300 group"
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Background with proper styling */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          background: isActive 
            ? 'rgba(99, 102, 241, 0.2)' 
            : isProtectedAndUnauthenticated
            ? 'rgba(239, 68, 68, 0.15)' // Red tint for protected routes
            : 'rgba(71, 85, 105, 0.3)',
          boxShadow: isActive 
            ? '0 8px 25px -8px rgba(99, 102, 241, 0.4), 0 0 0 2px rgba(99, 102, 241, 0.2)'
            : isProtectedAndUnauthenticated
            ? '0 4px 15px -4px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.2)'
            : '0 4px 15px -4px rgba(0, 0, 0, 0.3)'
        }}
      />
      
      {/* Hover overlay */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isActive 
            ? 'rgba(99, 102, 241, 0.15)' 
            : isProtectedAndUnauthenticated
            ? 'rgba(239, 68, 68, 0.1)'
            : 'rgba(99, 102, 241, 0.1)'
        }}
      />

      {/* Icon */}
      <div 
        className={`relative z-10 transition-colors duration-300 ${
          isActive 
            ? 'text-indigo-400' 
            : isProtectedAndUnauthenticated
            ? 'text-red-400 group-hover:text-red-300'
            : 'text-gray-300 group-hover:text-indigo-300'
        }`}
      >
        {icon}
      </div>

      {/* FIXED: Lock icon overlay for protected routes when not authenticated */}
      {isProtectedAndUnauthenticated && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
      
      {/* Enhanced Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-90 transition-all duration-300 pointer-events-none z-20">
        <div 
          className="text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm shadow-xl border"
          style={{
            background: isProtectedAndUnauthenticated 
              ? 'rgba(239, 68, 68, 0.95)' 
              : 'rgba(15, 23, 42, 0.95)',
            borderColor: isProtectedAndUnauthenticated 
              ? 'rgba(239, 68, 68, 0.3)' 
              : 'rgba(99, 102, 241, 0.3)'
          }}
        >
          {isProtectedAndUnauthenticated ? `🔒 Login required for ${title}` : title}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" 
            style={{ 
              borderTopColor: isProtectedAndUnauthenticated 
                ? 'rgba(239, 68, 68, 0.95)' 
                : 'rgba(15, 23, 42, 0.95)' 
            }}
          />
        </div>
      </div>
    </motion.div>
  );

  if (type === 'action') {
    return (
      <button onClick={handleClick} className="outline-none focus:outline-none">
        {content}
      </button>
    );
  }

  return (
    <Link to={href} onClick={handleLinkClick} className="outline-none focus:outline-none">
      {content}
    </Link>
  );
}

export default FloatingDock;
