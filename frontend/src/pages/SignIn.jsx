import React, { useContext, useState } from 'react';
import bg from "../assets/backgroundphoto.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, password
      }, { withCredentials: true });
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='w-full h-screen bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form
        className='w-[90%] h-150 max-w-125 bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-5'
        onSubmit={handleSignIn}
      >
        <h1 className='text-white text-3xl font-semibold mb-7.5'>
          Sign In to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder='Email'
          className='w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-lg'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className='w-full h-15 border-2 border-white bg-transparent text-white rounded-full text-lg relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-5 py-2.5'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!showPassword && <IoEye className='absolute top-4.5 right-5 w-6.25 h-6.25 text-white cursor-pointer' onClick={() => setShowPassword(true)} />}
          {showPassword && <IoEyeOff className='absolute top-4.5 right-5 w-6.25 h-6.25 text-white cursor-pointer' onClick={() => setShowPassword(false)} />}
        </div>

        {err && <p className='text-red-500 text-[17px]'>*{err}</p>}

        <button
          className='min-w-37.5 h-15 mt-7.5 text-black font-semibold bg-white rounded-full text-[19px]'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className='text-white text-lg cursor-pointer' onClick={() => navigate("/signup")}>
          Want to create a new account? <span className='text-blue-400'>Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
