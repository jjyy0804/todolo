import React, { useState, useRef } from 'react';
import defaultProfileImage from '../assets/images/basic_user_profile.png';
import useUserStore, { User } from '../store/useUserstore'; // Zustand store import
import apiClient from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserInfoModal({ isOpen, onClose }: UserInfoModalProps) {
  const { user, setUser } = useUserStore();
  const [profileImage, setProfileImage] = useState(
    user?.avatar || defaultProfileImage,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null); // useRef for file input
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // selectedFile state
  const [message, setMessage] = useState<string>(''); // Message state
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle between "Change" and "Save"
  const navigate = useNavigate(); // Initialize navigate for routing

  if (!isOpen) return null;

  /** Handle image change */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl); // Update the preview image
      setSelectedFile(file); // Save the selected file for uploading
      setIsEditing(true); // Set editing mode
    }
  };

  /** Handle file input click */
  const handleEditClick = () => {
    fileInputRef.current?.click(); // Trigger file input click
  };

  /** Handle save click */
  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return; // Ensure a file is selected

    const formData = new FormData();
    formData.append('avatar', selectedFile); // Append the file to the form data

    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await apiClient.post(
        '/api/users/update-profileImg',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Set correct content type
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        console.log('Profile picture updated');

        // Update user info including the avatar
        const newUserInfo: User = {
          ...user!,
          avatar: response.data.avatar, // Ensure this is correct
        };

        setUser(newUserInfo); // Update Zustand store
        setMessage('Profile picture updated successfully!'); // Success message
        setIsEditing(false); // Exit editing mode
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to update profile picture.'); // Set error message
    }
  };

  /** SetTeam click handler */
  const handleSetTeamClick = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await apiClient.post(
        `/api/users/send-confirmation-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data.message);
      alert('메일이 발송되었습니다. 확인해주세요.'); // Alert for email sent
    } catch (error) {
      console.log(error);
      alert('메일을 전송하는데 실패했습니다. 다시 시도해주세요.'); // Error message
    }
  };

  /** Change Password button click handler */
  const handleChangePasswordClick = () => {
    navigate('/update-password'); // Redirect to the change password page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2
          className="text-darkgray flex items-end justify-end text-[13px] font-regular mb-4 cursor-pointer"
          onClick={onClose}
        >
          X
        </h2>
        {/* Profile image */}
        <div className="relative w-24 h-24 mx-auto">
          <img
            src={profileImage}
            alt="profile_image"
            className="w-full h-full rounded-full"
          />
          {/* Change/Save button */}
        </div>
        <button
          className="bg-primary text-white font-bold rounded-10 flex items-center justify-center hover:bg-hoverprimary transition-colors ease-linear"
          onClick={isEditing ? handleSaveClick : handleEditClick}
        >
          {isEditing ? '변경' : '저장'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <p className="flex items-center justify-center mt-6 text-sm text-gray-600">
          {user?.email}
        </p>
        <div className="space-y-8 p-12 mt-6">
          <div className="flex items-center justify-between space-x-8">
            <label className="text-lg font-medium text-softgray w-1/4">
              이름
            </label>
            <span className="block w-full p-4 text-lg">{user?.name}</span>
          </div>

          <div className="flex items-center justify-between space-x-8 mt-6">
            <label className="text-lg font-medium text-softgray w-1/4">
              소속
            </label>
            <span className="block w-full p-4 text-lg">
              {user?.team ? (
                user.team
              ) : (
                <button
                  type="button"
                  className="text-blue-500 underline"
                  onClick={handleSetTeamClick}
                >
                  소속팀설정
                </button>
              )}
            </span>
          </div>

          {/* Change Password Button */}
          <p
            className="text-blue-600 cursor-pointer text-lg hover:underline mt-4"
            onClick={handleChangePasswordClick}
          >
            비밀번호 변경
          </p>
        </div>
        {message && <p className="text-center text-green-600">{message}</p>}{' '}
        {/* Display message */}
      </div>
    </div>
  );
}
