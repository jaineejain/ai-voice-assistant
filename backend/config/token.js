// Import jsonwebtoken library for creating and verifying JWT tokens
import jwt from "jsonwebtoken"

// Define an asynchronous function to generate a JWT for a given user ID
const genToken = async (userId) => {
    try {
        // Create a JWT token with the userId as payload
        // Use the secret from environment variables
        // Set token to expire in 10 days
        const token = await jwt.sign(
            { userId },                 // Payload
            process.env.JWT_SECRET,     // Secret key
            { expiresIn: "10d" }        // Expiration
        )

        // Return the generated token
        return token
    } catch (error) {
        // Log any errors that occur during token generation
        console.log(error)
    }
}

// Export the function to use it in other parts of the project
export default genToken
