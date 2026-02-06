import React, { useContext, useState } from "react"
import axios from "axios"
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

import bg from "../assets/backgroundphoto.png"
import { userDataContext } from "../context/UserContext"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const { serverUrl, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      )

      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%] h-150 max-w-125 bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-5"
      >
        <h1 className="text-white text-3xl font-semibold mb-7.5">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-lg"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-lg"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-15 border-2 border-white bg-transparent text-white rounded-full text-lg relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-5 py-2.5"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!showPassword && (
            <IoEyeSharp
              className="absolute top-4.5 right-5 w-6.25 h-6.25 text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}

          {showPassword && (
            <IoEyeOffSharp
              className="absolute top-4.5 right-5 w-6.25 h-6.25 text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err && <p className="text-red-500 text-[17px]">*{err}</p>}

        <button
          disabled={loading}
          className="min-w-37.5 h-15 mt-7.5 text-black font-semibold bg-white rounded-full text-[19px]"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-white text-lg cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  )
}

export default SignUp
