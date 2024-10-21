import React, { useState, useRef, useEffect } from 'react';
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

  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  console.log({ profileImage });
  const fileInputRef = useRef<HTMLInputElement | null>(null); // useRef for file input
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // selectedFile state
  const [message, setMessage] = useState<string>(''); // Message state
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle between "Change" and "Save"
  const navigate = useNavigate(); // Initialize navigate for routing

  useEffect(() => {
    if (isOpen) {
      const initialAvatarUrl =
        user?.avatar && user.avatar.includes('uploads/')
          ? `/uploads/${user.avatar.split('uploads/')[1]}`
          : defaultProfileImage; // 기본 이미지 사용
      setProfileImage(initialAvatarUrl);
    }
  }, [isOpen]);

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

    const accessToken = localStorage.getItem('accessToken');

    try {
      const formData = new FormData();

      // Append file(s) to the FormData object
      formData.append('avatar', selectedFile);

      // Make PUT request to the server
      apiClient
        .put('/api/users/update-profileImg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`, // Add authorization header
          },
        })
        .then((response) => {
          if (response.status === 200) {
            apiClient
              .get('/api/users/me', {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .then((userData) => {
                setUser(userData.data.data);
                setMessage('Profile picture updated successfully!'); // Success message
                setIsEditing(false); // Exit editing mode
                onClose(); // Close the modal
              });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage('Failed to update profile picture.'); // Error message
        });
    } catch (error) {
      console.error('Error during file processing:', error);
      setMessage('Failed to process file.');
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
  const changePasswordClick = () => {
    navigate('/update-password'); // Redirect to the change password page
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-[500px] max-h-[80vh] p-6 rounded-lg relative overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-softgray hover:text-darkgray"
          >
            &times;
          </button>

          {/* Profile image */}
          <div className='flex flex-col items-center mb-6"'>
            <div className="w-24 h-24 rounded-full border flex items-center justify-center relative cursor-pointer">
              <img
                src={profileImage}
                alt="profile_image"
                className="w-full h-full rounded-full"
              />
            </div>
            {/* Change/Save button */}
            <button
              className="mt-2 text-sm text-primary"
              onClick={isEditing ? handleSaveClick : handleEditClick}
            >
              {isEditing ? '저장' : '프로필사진 변경'}
            </button>
          </div>
          <input
            disabled
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <p className="flex items-center justify-center mt-6 text-sm text-dartgray">
            {user?.email}
          </p>
          <div className="space-y-8 p-[3rem] mt-6">
            <div className="flex items-center justify-between space-x-8">
              <label className="block text-base font-medium text-softgray w-1/3">
                이름
              </label>

              <span className="mt-1 block w-full p-4 text-left text-dartgray">
                {user?.name}
              </span>
            </div>

            <div className="flex items-center justify-between space-x-8 mt-6">
              <label className="block text-base font-medium text-softgray w-1/3">
                소속
              </label>
              <span className="mt-1 block w-full p-4 text-left text-dartgray">
                {user?.team ? (
                  user.team
                ) : (
                  <button
                    type="button"
                    className="text-left mt-1 block w-full p-4 text-primary hover:text-[#257ada]"
                    onClick={handleSetTeamClick}
                  >
                    소속팀설정
                  </button>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between space-x-8 mt-6">
              <label className="block text-base font-medium text-softgray w-1/3">
                비밀번호
              </label>
              <span className="mt-1 block w-full p-4">
                <button
                  type="button"
                  className="mt-1 block w-full text-left text-primary hover:text-[#257ada]"
                  onClick={changePasswordClick}
                >
                  비밀번호 변경
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
