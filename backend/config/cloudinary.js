// Import Cloudinary's v2 API
import { v2 as cloudinary } from 'cloudinary';

// Import Node.js file system module to handle local files
import fs from "fs"

// Define an asynchronous function to upload a file to Cloudinary
const uploadOnCloudinary = async (filePath) => {

    // Configure Cloudinary with credentials from environment variables
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
        api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
        api_secret: process.env.CLOUDINARY_API_SECRET  // Your Cloudinary API secret
    });

    try {
        // Upload the file located at 'filePath' to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath)

        // Delete the local file after successful upload to save space
        fs.unlinkSync(filePath)

        // Return the secure URL of the uploaded image
        return uploadResult.secure_url

    } catch (error) {
        // If an error occurs during upload, delete the local file
        fs.unlinkSync(filePath)

        // Return a 500 error response (note: 'res' may not exist here if used outside Express)
        return res.status(500).json({ message: "cloudinary error" })
    }
}

// Export the function so it can be imported and used in other parts of the project
export default uploadOnCloudinary
