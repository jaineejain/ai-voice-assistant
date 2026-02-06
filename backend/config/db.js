// Import mongoose, a popular MongoDB ODM (Object Data Modeling) library
import mongoose from "mongoose"

// Define an asynchronous function to connect to the MongoDB database
const connectDb = async () => {
    try {
        // Connect to MongoDB using the URL from environment variables
        await mongoose.connect(process.env.MONGODB_URL)

        // Log a success message if the connection is successful
        console.log("db connected")
    } catch (error) {
        // If an error occurs during connection, log the error
        console.log(error)
    }
}

// Export the connectDb function so it can be used in other parts of the project
export default connectDb
