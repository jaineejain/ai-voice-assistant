import React, { useContext, useRef } from 'react'
import Card from '../components/Card'
import photo1 from "../assets/photo1.png"
import photo2 from "../assets/photo2.jpeg"
import photo3 from "../assets/photo3.jpeg"
import photo4 from "../assets/photo4.png"
import photo5 from "../assets/photo5.png"
import photo6 from "../assets/photo6.png"
import photo7 from "../assets/photo7.png"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {

  const {backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}
  = useContext(userDataContext)

  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className='relative w-full min-h-screen flex justify-center items-center 
    bg-linear-to-t from-black via-[#030353] to-black'>

        {/* glow background */}
        <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full bottom-10 right-10"></div>

        {/* back button */}
        <MdKeyboardBackspace 
          className='absolute top-8 left-8 text-white cursor-pointer w-7 h-7 hover:scale-110 transition'
          onClick={()=>navigate("/")}
        />

        {/* main card */}
        <div className='relative w-full max-w-6xl bg-white/5 backdrop-blur-2xl 
        border border-white/10 rounded-3xl px-10 py-12 shadow-2xl flex flex-col items-center'>

            <h1 className='text-white text-4xl font-semibold text-center mb-3'>
              Choose Your <span className='text-blue-400'>AI Assistant</span>
            </h1>

            <p className='text-gray-300 mb-10 text-center'>
              Select an avatar to personalize your assistant
            </p>

            {/* Cards alignment SAME as previous */}
            <div className='w-full max-w-225 flex justify-center items-center flex-wrap gap-6'>

              <Card image={photo1}/>
              <Card image={photo2}/>
              <Card image={photo3}/>
              <Card image={photo4}/>
              <Card image={photo5}/>
              <Card image={photo6}/>
              <Card image={photo7}/>

              {/* upload card */}
              <div 
                className={`w-32 h-52 bg-[#020220] border-2 border-blue-500/30 rounded-2xl 
                overflow-hidden cursor-pointer hover:scale-105 transition flex items-center 
                justify-center ${selectedImage==="input"?"border-4 border-white shadow-2xl shadow-blue-900 ":null}`} 
                onClick={()=>{
                  inputImage.current.click()
                  setSelectedImage("input")
                }}
              >
                {!frontendImage &&  <RiImageAddLine className='text-white w-10 h-10'/>}
                {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
              </div>

              <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
            </div>

            {/* Continue button */}
            {selectedImage && 
              <button 
                className='mt-12 px-12 py-4 text-lg font-semibold text-white rounded-full
                bg-linear-to-r from-blue-500 to-purple-500
                hover:scale-105 transition shadow-xl'
                onClick={()=>navigate("/customize2")}
              >
                Continue
              </button>
            }

        </div>
    </div>
  )
}

export default Customize
