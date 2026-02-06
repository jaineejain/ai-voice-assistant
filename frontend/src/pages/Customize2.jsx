import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {

    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        setLoading(true)
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)

            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }

            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })

            setLoading(false)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <div className='relative w-full min-h-screen flex justify-center items-center
        bg-linear-to-t from-black via-[#030353] to-black'>

            {/* glow background */}
            <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full bottom-10 right-10"></div>

            {/* Back Button */}
            <MdKeyboardBackspace
                className='absolute top-8 left-8 text-white cursor-pointer w-7 h-7 hover:scale-110 transition'
                onClick={() => navigate("/customize")}
            />

            {/* Main Card */}
            <div className='relative w-full max-w-3xl bg-white/5 backdrop-blur-2xl
            border border-white/10 rounded-3xl px-10 py-12 shadow-2xl
            flex flex-col items-center'>

                {/* Assistant Preview (same size as Card.jsx) */}
                {(backendImage || selectedImage) && (
                    <img
                        src={backendImage ? URL.createObjectURL(backendImage) : selectedImage}
                        alt="assistant"
                        className='w-17.5 h-35 lg:w-37.5 lg:h-62.5
                        object-cover rounded-2xl mb-8
                        border-4 border-white shadow-2xl shadow-blue-900'
                    />
                )}

                <h1 className='text-white text-3xl font-semibold mb-6 text-center'>
                    Enter Your <span className='text-blue-400'>Assistant Name</span>
                </h1>

                {/* Input */}
                <input
                    type="text"
                    placeholder='eg. Shifra'
                    className='w-full max-w-xl h-14 outline-none border border-white/30
                    bg-white/10 text-white placeholder-gray-300 px-6
                    rounded-full text-lg mb-6'
                    required
                    onChange={(e) => setAssistantName(e.target.value)}
                    value={assistantName}
                />

                {/* Button */}
                {assistantName &&
                    <button
                        className='w-full max-w-xl h-14
                        bg-linear-to-r from-blue-500 to-purple-500
                        hover:scale-105 transition
                        text-white font-semibold cursor-pointer
                        rounded-full text-lg shadow-xl'
                        disabled={loading}
                        onClick={handleUpdateAssistant}
                    >
                        {!loading ? "Finally Create Your Assistant" : "Loading..."}
                    </button>
                }

            </div>
        </div>
    )
}

export default Customize2
