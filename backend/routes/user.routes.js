// Import express to create router
import express from "express"

// Import controller functions for user-related operations
import {
  askToAssistant,
  getCurrentUser,
  updateAssistant
} from "../controllers/user.controllers.js"

// Import authentication middleware to protect routes
import isAuth from "../middlewares/isAuth.js"

// Import multer middleware to handle file uploads
import upload from "../middlewares/multer.js"

// Create a new router instance
const userRouter = express.Router()

/**
 * GET CURRENT USER
 * Endpoint: GET /current
 * Middleware: isAuth (only authenticated users)
 * Controller: getCurrentUser
 */
userRouter.get(
  "/current",
  isAuth,           // Ensure user is authenticated
  getCurrentUser     // Return user data
)

/**
 * UPDATE ASSISTANT
 * Endpoint: POST /update
 * Middleware: isAuth + multer (file upload)
 * Controller: updateAssistant
 */
userRouter.post(
  "/update",
  isAuth,                         // Ensure user is authenticated
  upload.single("assistantImage"), // Handle single file upload with field name 'assistantImage'
  updateAssistant                  // Update assistant info in DB
)

/**
 * ASK TO ASSISTANT
 * Endpoint: POST /asktoassistant
 * Middleware: isAuth
 * Controller: askToAssistant
 */
userRouter.post(
  "/asktoassistant",
  isAuth,           // Ensure user is authenticated
  askToAssistant     // Handle assistant commands/questions
)

// Export the router to use in the main server file
export default userRouter
