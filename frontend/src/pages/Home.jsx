import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Menu, LogOut, Settings, X, Clock, CloudRain, Youtube, Calculator } from 'lucide-react'

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [typing, setTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState([])

  const recognitionRef = useRef(null)
  const isSpeakingRef = useRef(false)
  const synth = window.speechSynthesis

  // Handle Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
    } catch (error) {
      console.log(error)
    }
    setUserData(null)
    navigate("/signin")
  }

  // Speak function
  const speak = (text) => {
    if (!text) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'

    isSpeakingRef.current = true
    utterance.onend = () => {
      isSpeakingRef.current = false
      setAiText("")
      setTyping(false)
    }

    synth.cancel()
    synth.speak(utterance)
  }

  // Handle voice recognition
  useEffect(() => {
    if (!userData) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      setUserText(transcript)

      if (!transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) return

      setTyping(true)
      const apiResponse = await getGeminiResponse(transcript)
      const responseText = apiResponse.response || apiResponse

      setChatHistory(prev => [
        ...prev,
        { sender: 'user', text: transcript },
        { sender: 'assistant', text: responseText }
      ])

      setAiText(responseText)
      speak(responseText)
    }

    recognition.start()
    return () => recognition.stop()
  }, [userData])

  // Quick actions
  const handleQuickAction = async (actionText) => {
    setUserText(actionText)
    setTyping(true)
    const apiResponse = await getGeminiResponse(actionText)
    const responseText = apiResponse.response || apiResponse

    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: actionText },
      { sender: 'assistant', text: responseText }
    ])
    setAiText(responseText)
    speak(responseText)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col">

      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 py-4 text-white">
        <h1 className="text-xl font-semibold">AI Assistant</h1>
        <button onClick={() => setMenuOpen(true)} className="p-2 rounded-full hover:bg-white/10">
          <Menu />
        </button>
      </div>

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-[#0b0b2e] text-white shadow-xl transform transition-transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="font-semibold">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <button
            onClick={() => navigate('/customize')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 p-3 rounded-xl">
            <Settings size={18} /> Customize Assistant
          </button>

          <button
            onClick={handleLogOut}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 p-3 rounded-xl">
            <LogOut size={18} /> Log Out
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold mb-3">History</h3>
          <div className="h-64 overflow-y-auto text-sm text-gray-300 space-y-2">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={msg.sender === 'user' ? 'text-right text-blue-400' : 'text-left text-green-400'}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col justify-start items-center gap-4 p-4">

        {/* Animated Assistant Avatar */}
        <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/20">
          <img src={userData?.assistantImage} alt="assistant" className="h-full w-full object-cover" />
        </div>

        {/* Assistant Name */}
        <h1 className="text-white text-2xl font-bold mt-2">I'm {userData?.assistantName}</h1>

        {/* Quick Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button onClick={() => handleQuickAction("What's the time?")} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl flex items-center gap-2">
            <Clock size={18} /> Time
          </button>
          <button onClick={() => handleQuickAction("What's the weather?")} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl flex items-center gap-2">
            <CloudRain size={18} /> Weather
          </button>
          <button onClick={() => handleQuickAction("Open YouTube")} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl flex items-center gap-2">
            <Youtube size={18} /> YouTube
          </button>
          <button onClick={() => handleQuickAction("Open calculator")} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl flex items-center gap-2">
            <Calculator size={18} /> Calculator
          </button>
        </div>

        {/* Chat Area */}
        <div className="w-full max-w-md mt-6 flex flex-col gap-2 overflow-y-auto">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-xl max-w-[80%] ${msg.sender === 'user' ? 'self-end bg-blue-700 text-white' : 'self-start bg-green-700 text-white'}`}>
              {msg.text}
            </div>
          ))}

          {typing && (
            <div className="self-start p-3 rounded-xl bg-green-700 text-white animate-pulse">
              {userData?.assistantName} is typing...
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Home
