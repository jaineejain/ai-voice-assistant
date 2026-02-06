// Import express to create router
import express from "express"

// Import controller functions for authentication
import { Login, logOut, signUp } from "../controllers/auth.controllers.js"

// Create a new router instance
const authRouter = express.Router()

/**
 * SIGN UP ROUTE
 * Endpoint: POST /signup
 * Calls signUp controller to register a new user
 */
authRouter.post("/signup", signUp)

/**
 * SIGN IN ROUTE
 * Endpoint: POST /signin
 * Calls Login controller to authenticate an existing user
 */
authRouter.post("/signin", Login)

/**
 * LOG OUT ROUTE
 * Endpoint: GET /logout
 * Calls logOut controller to clear the authentication cookie
 */
authRouter.get("/logout", logOut)

// Export the router to use in main server file
export default authRouter
