import React, { useState, useEffect, useCallback } from 'react';
import { BrowserButton } from "../components/Buttons"
import "../css/OSWindow.css"

function OSWindow({ title, taskbarItems, browserItems, descriptionText, children, className, contentClassName, disableTaskbar, removePadding, outerChildren }) {

  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [browserIsClosed, setBrowserClosed] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
      if (isMaximized) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'auto';
      }
      return () => {
          document.body.style.overflow = 'auto';
      };
  }, [isMaximized]);

  const handleClose = () => {
      setIsClosed(true);
  }

  const handleMaximize = () => {
      setIsMinimized(false);
      setIsMaximized(!isMaximized);
  }

  const handleMinimize = () => {
      setIsMaximized(false);
      setIsMinimized(!isMinimized);
  }

  const handleBrowser = () => {
    setBrowserClosed(!browserIsClosed);
  }

  if (isClosed) return null;

  // Allows you to pass in a BrowserButton anywhere in the taskbar while maintaining it's handleBrowser functionality
  const swapBrowserButton = (component) => {
    if (component.type.displayName === 'BrowserButton') {
      return <BrowserButton onClick={handleBrowser} {...component.props} />;
    }
    return component;
  }

  return (
    <div className={`OSWindow ${isMaximized ? 'Maximized' : ''} ${className}`}>
      {outerChildren}
        <div className="MenuBar">

            <div className="MenuButton" onClick={handleClose}>
                <img src="/png/close.png" alt="Close"></img>
            </div>
            <div className="MenuButton" onClick={handleMaximize}>
                <img src="/png/maximize.png" alt="Maximize"></img>
            </div>
            <div className="MenuButton" onClick={handleMinimize}>
                <img src="/png/minimize.png" alt="Minimize"></img>
            </div>
            <div className="ProgramText">
                {title}
            </div>

        </div>
  
        <div className={`BrowserWindowContainer ${isMinimized ? 'Minimized' : ''} ${isMaximized ? 'Maximized' : ''} ${(browserIsClosed && !isMinimized) ? 'BrowserClosed' : ''}`}>
          <div className={`Browser ${browserIsClosed ? 'BrowserClosed' : ''}`}>
          <div className="BrowserItemContainer">
          {browserItems && browserItems.map((item, index) => (
                  <div key={index} className="BrowserItem"
                  style={index === browserItems.length - 1 ? { flexGrow: 1 } : {}}>
                      { swapBrowserButton(item) }
                  </div>
              ))}
          </div>
          </div>
          <div className={`OSYellowWindow ${isMaximized ? 'Maximized' : ''} ${browserIsClosed ? 'BrowserClosed' : ''} ${removePadding ? 'RemovePadding' : ''}`}>
            <div className={`ContentContainer  ${isMaximized ? 'Maximized' : ''} ${contentClassName}`}>
              {children}
            </div>
              <div className={`Taskbar ${disableTaskbar ? 'Disable' : ''}`}>

              {taskbarItems && taskbarItems.map((item, index) => (
                  <div key={index} className="TaskbarItem">
                      { swapBrowserButton(item) }
                  </div>
              ))}
          
              <div className="DescriptionText">
                <h3 className="PurpleFlashText Right">
                  { descriptionText }
                </h3>
              </div>
            </div>
          </div>

        </div>
    </div>
  );
}

export default OSWindow;