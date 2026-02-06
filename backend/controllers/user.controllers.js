// Import helper to upload files to Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js"

// Import your custom function to handle AI/groq responses
import groqResponse from "../groq.js"

// Import User model to interact with MongoDB
import User from "../models/user.model.js"

// Import moment.js for date/time formatting
import moment from "moment"

/**
 * GET CURRENT USER
 * Retrieves the currently logged-in user's data
 */
export const getCurrentUser = async (req, res) => {
  try {
    // Find user by ID stored in req.userId and exclude password
    const user = await User.findById(req.userId).select("-password")

    if (!user) {
      // Return 400 if user is not found
      return res.status(400).json({ message: "User not found" })
    }

    // Respond with user data
    return res.status(200).json(user)
  } catch (error) {
    console.error("getCurrentUser error:", error)
    return res.status(500).json({ message: "Get current user error" })
  }
}

/**
 * UPDATE ASSISTANT
 * Updates the assistant's name and image for the logged-in user
 */
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body
    let assistantImage

    // If a new file is uploaded, upload it to Cloudinary
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path)
    } else {
      // Otherwise, use the provided image URL
      assistantImage = imageUrl
    }

    // Update the user's assistant details in the database
    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true } // Return the updated document
    ).select("-password")

    return res.status(200).json(user)
  } catch (error) {
    console.error("updateAssistant error:", error)
    return res.status(500).json({ message: "Update assistant error" })
  }
}

/**
 * ASK TO ASSISTANT
 * Handles commands/questions sent to the assistant and returns AI responses
 */
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body

    // Find the current user
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(400).json({ response: "User not found" })
    }

    // Save user input to history
    user.history.push(command)
    await user.save()

    // Get AI/groq response based on command, assistant name, and user name
    const result = await groqResponse(command, user.assistantName, user.name)

    if (!result) {
      // Return fallback if AI service fails
      return res.json({
        type: "general",
        userInput: command,
        response: "Assistant service unavailable."
      })
    }

    // Try to safely parse AI response as JSON
    let aiResult
    try {
      const jsonMatch = result.match(/{[\s\S]*}/)
      if (!jsonMatch) throw new Error("No JSON found")

      aiResult = JSON.parse(jsonMatch[0])
    } catch (err) {
      console.error("AI JSON parse error:", err)
      return res.json({
        type: "general",
        userInput: command,
        response: "Sorry, I couldn't understand that."
      })
    }

    const { type } = aiResult

    // Handle different command types
    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        })

      case "get-time":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        })

      case "get-day":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Today is ${moment().format("dddd")}`
        })

      case "get-month":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`
        })

      // These types use AI response directly
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: aiResult.response
        })

      // Fallback for unknown types
      default:
        return res.json({
          type: "general",
          userInput: command,
          response: "I didn't understand that command."
        })
    }
  } catch (error) {
    console.error("askToAssistant error:", error)
    return res.status(500).json({ response: "Ask assistant error" })
  }
}
