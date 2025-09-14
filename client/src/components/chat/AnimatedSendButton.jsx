import React, { useState } from 'react';

const AnimatedSendButton = ({ onClick, disabled }) => {
  const [isSending, setIsSending] = useState(false);

  const handleClick = async () => {
    if (disabled) return;
    
    setIsSending(true);
    await onClick();
    
    // Reset after animation
    setTimeout(() => {
      setIsSending(false);
    }, 800);
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden group
        flex items-center justify-center
        w-10 h-10 rounded-lg
        transition-all duration-200 ease-in-out
        ${disabled 
          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' 
          : isSending
          ? 'bg-green-500 text-white scale-95'
          : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
        }
        shadow-md hover:shadow-lg
      `}
    >
      {/* Send Icon */}
      <div className={`
        transition-all duration-300
        ${isSending ? 'rotate-45 scale-110' : 'group-hover:translate-x-0.5'}
      `}>
        {isSending ? (
          // Success checkmark
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        ) : (
          // Send icon (paper plane)
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
        )}
      </div>

      {/* Simple shine effect on hover */}
      {!disabled && (
        <div className={`
          absolute inset-0 rounded-lg
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          transform -translate-x-full
          transition-transform duration-500
          ${!isSending ? 'group-hover:translate-x-full' : ''}
        `} />
      )}
    </button>
  );
};

export default AnimatedSendButton;