// Import jsonwebtoken to verify JWT tokens
import jwt from "jsonwebtoken"

/**
 * Authentication Middleware
 * Checks if the incoming request has a valid JWT token
 */
const isAuth = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.token

    // If token does not exist, return 400 error
    if (!token) {
      return res.status(400).json({ message: "token not found" })
    }

    // Verify the token using the secret key
    const verifyToken = await jwt.verify(
      token,                  // JWT token from cookie
      process.env.JWT_SECRET  // Secret key from environment variable
    )

    // Attach the userId from the token payload to the request object
    req.userId = verifyToken.userId

    // Proceed to the next middleware or route handler
    next()

  } catch (error) {
    // Log any errors during token verification
    console.log(error)

    // Return a 500 error if something goes wrong
    return res.status(500).json({ message: "is Auth error" })
  }
}

// Export the middleware to use in protected routes
export default isAuth
