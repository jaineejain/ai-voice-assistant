// Import mongoose to define schema and model
import mongoose from "mongoose"

/**
 * Define the User schema
 * This represents a user in the MongoDB database
 */
const userSchema = new mongoose.Schema({
  // User's name (required)
  name: {
    type: String,
    required: true
  },

  // User's email (required and must be unique)
  email: {
    type: String,
    required: true,
    unique: true
  },

  // User's password (required, will be hashed)
  password: {
    type: String,
    required: true
  },

  // Name of the AI assistant assigned to the user
  assistantName: {
    type: String
  },

  // Image URL of the AI assistant
  assistantImage: {
    type: String
  },

  // History of commands/questions the user has asked
  history: [
    { type: String }
  ]

}, { 
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
})

// Create the User model from the schema
const User = mongoose.model("User", userSchema)

// Export the User model for use in other parts of the project
export default User
