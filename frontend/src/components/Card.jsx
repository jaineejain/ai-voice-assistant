// Import React and useContext hook
import React, { useContext } from 'react'

// Import the userDataContext to access shared state
import { userDataContext } from '../context/UserContext'

/**
 * Card Component
 * Displays an image card that can be selected
 * Props:
 *   - image: URL of the image to display
 */
function Card({ image }) {
  // Access context values from userDataContext
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext)

  return (
    <div
      className={`
        w-17.5 h-35 lg:w-37.5 lg:h-62.5          // Width & height (responsive)
        bg-[#020220]                               // Card background color
        border-2 border-[#0000ff66]                // Default border
        rounded-2xl                                // Rounded corners
        overflow-hidden                             // Prevent content overflow
        hover:shadow-2xl hover:shadow-blue-950     // Shadow on hover
        cursor-pointer                             // Pointer cursor on hover
        hover:border-4 hover:border-white          // Border on hover
        ${selectedImage === image 
          ? "border-4 border-white shadow-2xl shadow-blue-950" 
          : null}                                  // Highlight if selected
      `}
      // Handle card click
      onClick={() => {
        setSelectedImage(image)   // Set this image as selected
        setBackendImage(null)     // Reset backend image
        setFrontendImage(null)    // Reset frontend image
      }}
    >
      {/* Display image inside the card */}
      <img
        src={image}
        className='h-full object-cover' // Cover entire card
      />
    </div>
  )
}

// Export Card component to use in other parts of the app
export default Card
