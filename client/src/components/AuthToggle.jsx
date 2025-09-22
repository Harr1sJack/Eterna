import React from 'react';
import styled from 'styled-components';

const AuthToggle = ({ mode, onModeChange, theme }) => {
  
  return (
    <StyledWrapper theme={theme}>
      <div className="toggle-container">
        <button
          className={`toggle-button ${mode === 'signin' ? 'active' : ''}`}
          onClick={() => {
            onModeChange('signin');
          }}
        >
          Sign In
        </button>
        <button
          className={`toggle-button ${mode === 'register' ? 'active' : ''}`}
          onClick={() => {
            onModeChange('register');
          }}
        >
          Register
        </button>
        <div className={`slider ${mode === 'register' ? 'register' : 'signin'}`}></div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .toggle-container {
    position: relative;
    display: flex;
    background: ${props => props.theme === 'dark' 
      ? 'rgba(10, 10, 10, 0.9)' 
      : 'rgba(255, 255, 255, 0.9)'
    };
    border-radius: 25px;
    padding: 4px;
    width: 280px;
    height: 50px;
    border: 2px solid ${props => props.theme === 'dark' 
      ? 'rgba(147, 51, 234, 0.4)' 
      : 'rgba(16, 137, 211, 0.3)'
    };
    box-shadow: ${props => props.theme === 'dark' 
      ? 'rgba(147, 51, 234, 0.3) 0px 10px 20px -10px' 
      : 'rgba(133, 189, 215, 0.4) 0px 10px 20px -10px'
    };
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  .toggle-button {
    flex: 1;
    background: transparent;
    border: none;
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;
    border-radius: 20px;
    position: relative;
  }

  .toggle-button:hover {
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
  }

  .toggle-button.active {
    color: white;
    font-weight: 700;
  }

  .slider {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: ${props => props.theme === 'dark' 
      ? 'linear-gradient(45deg, rgb(147, 51, 234) 0%, rgb(168, 85, 247) 100%)' 
      : 'linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)'
    };
    border-radius: 20px;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 1;
    box-shadow: ${props => props.theme === 'dark' 
      ? '0px 8px 16px -8px rgba(147, 51, 234, 0.5), 0 0 15px rgba(147, 51, 234, 0.3)' 
      : '0px 8px 16px -8px rgba(16, 137, 211, 0.5), 0 0 15px rgba(16, 137, 211, 0.3)'
    };
  }

  .slider:hover {
    box-shadow: ${props => props.theme === 'dark' 
      ? '0px 12px 24px -8px rgba(147, 51, 234, 0.7), 0 0 25px rgba(147, 51, 234, 0.5)' 
      : '0px 12px 24px -8px rgba(16, 137, 211, 0.7), 0 0 25px rgba(16, 137, 211, 0.5)'
    };
  }

  /* Force the slider position based on the mode */
  .slider.register {
    transform: translateX(136px) !important; /* Half of 280px width minus padding */
  }

  .slider.signin {
    transform: translateX(0px) !important;
  }
`;

export default AuthToggle;