import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logos/todolo_logo_main.png';
import rightSectionImg from '../assets/ladingPage_r_img.jpg';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center lg:w-1/2 bg-white">
        <img src={logo} alt="Logo" className="w-1/3 mb-20" />
        <div className="w-1/3 flex justify-around">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="border border-blue-500 text-blue-500 py-3 px-6 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="relative lg:w-1/2 hidden lg:flex justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${rightSectionImg})` }}
      >
        <div className="absolute inset-0 bg-white opacity-60" />
      </div>
    </div>
  );
}
