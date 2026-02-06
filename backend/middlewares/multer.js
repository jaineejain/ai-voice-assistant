// Import multer, a middleware for handling multipart/form-data (file uploads)
import multer from "multer"

/**
 * Configure storage for multer
 * Specifies where and how uploaded files should be saved
 */
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, "./public") // Files will be saved in the 'public' directory
  },

  // Set the filename for the uploaded file
  filename: (req, file, cb) => {
    cb(null, file.originalname) // Keep the original file name
  }
})

// Create the multer upload middleware with the defined storage
const upload = multer({ storage })

// Export the upload middleware to use in routes
export default upload
