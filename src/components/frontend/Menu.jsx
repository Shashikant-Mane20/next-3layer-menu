"use client";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { menuData } from "../../app/menuData";

const NavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuStack, setMenuStack] = useState([]); // Stack to manage navigation levels
  const [selectedContent, setSelectedContent] = useState(null); // Content to show in the card
  const [isSliding, setIsSliding] = useState(false); // State for animation

  // Set default selected content to the first submenu item when the component mounts
  useEffect(() => {
    const firstMenuItem = menuData[0]; // Get the first menu item
    if (firstMenuItem.submenu) {
      setMenuStack([firstMenuItem.submenu]); // Push the submenu to the stack if available
      setSelectedContent(firstMenuItem.submenu[0]); // Set the first submenu item as selected
    } else {
      setSelectedContent(firstMenuItem); // If no submenu, set the first item as selected
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setMenuStack([]); // Reset to main menu
    setSelectedContent(null); // Reset selected content
  };

  const handleSubmenu = (submenu) => {
    if (submenu) {
      setIsSliding(true); // Start sliding
      setTimeout(() => {
        setMenuStack([...menuStack, submenu]); // Push submenu onto the stack
        setSelectedContent(submenu[0]); // Set the first item of the submenu as selected
        setIsSliding(false); // End sliding
      }, 300); // Duration of slide animation
    }
  };

  const handleBack = () => {
    setIsSliding(true); // Start sliding
    setTimeout(() => {
      const updatedStack = menuStack.slice(0, -1); // Pop the last submenu off the stack
      setMenuStack(updatedStack);
      setSelectedContent(null); // Reset content when going back
      setIsSliding(false); // End sliding
    }, 300); // Duration of slide animation
  };

  const handleItemClick = (item) => {
    setSelectedContent(item); // Set content for the clicked item
  };

  const currentMenu = menuStack.length
    ? menuStack[menuStack.length - 1]
    : menuData; // Determine the current menu level

  return (
    <>
      {/* Navbar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 w-full z-50">
        <button
          onClick={handleMenuToggle}
          className="w-8 h-8 flex items-center justify-center"
        >
          {isMenuOpen ? (
            <AiOutlineClose className="text-2xl" />
          ) : (
            <AiOutlineMenu className="text-2xl" />
          )}
        </button>
        <span className="text-lg font-bold">My App</span>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-white shadow-lg transition-transform duration-500 ease-in-out w-full lg:w-1/3 z-40 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`relative h-full transition-transform duration-300 ease-in-out ${
            isSliding ? "transform translate-x-[-100%]" : "transform translate-x-0"
          }`}
        >
          <div className="space-y-4 p-4">
            {/* Back Button */}
            {menuStack.length > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-black mb-4"
              >
                <IoMdArrowBack />
                <span>Back</span>
              </button>
            )}

            {/* Current Menu Items */}
            {currentMenu.map((item, index) => (
              <div key={index}>
                <button
                  onClick={
                    item.submenu
                      ? () => handleSubmenu(item.submenu)
                      : () => handleItemClick(item)
                  }
                  className="flex items-center justify-between w-full text-left text-gray-600 hover:text-black px-3 py-2 rounded-md"
                >
                  <span>{item.name}</span>
                  {item.submenu && <IoIosArrowForward />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area for Selected Submenu Item */}
      {isMenuOpen && selectedContent && (
        <div className="fixed top-16 right-0 h-[calc(100%-4rem)] w-full lg:w-2/3 bg-gray-100 p-6 shadow-lg z-40 overflow-auto hidden lg:block">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{selectedContent.name}</h2>
            <button
              onClick={() => setSelectedContent(null)}
              className="text-gray-500 hover:text-black"
            >
              <AiOutlineClose className="text-2xl" />
            </button>
          </div>
          <div className="mt-4">
            {/* Display the Image of the Selected Item */}
            {selectedContent.image && (
              <img
                src={selectedContent.image}
                alt={selectedContent.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-gray-700">
              This is the content for "{selectedContent.name}". You can add
              dynamic content here based on the item clicked.
            </p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Read More
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavMenu;
