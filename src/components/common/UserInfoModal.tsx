import React, { useState, useRef } from 'react';
import basicProfileImage from '../../assets/images/basic_user_profile.png';
import { FaCheckCircle } from 'react-icons/fa';
import useUserStore from '../../store/useUserstore'; // Zustand 스토어 임포트
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// props 타입 정의
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  if (!isOpen) return null;

  const { user } = useUserStore(); // Zustand에서 user 정보 가져오기
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    user?.avatar || `${basicProfileImage}`,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null); // useRef로 파일 인풋을 참조
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isEditable, setIsEditable] = useState(false); // 프로필 이미지 및 비밀번호 수정 가능 여부
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // selectedFile 상태 정의

  /** 파일 선택 시 profileImage의 상태를 해당 url로 변경 */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  /** 프로필 이미지 클릭 시 파일 선택 가능 */
  const handleImageClick = () => {
    if (isEditable) {
      fileInputRef.current?.click(); // useRef로 파일 인풋을 클릭
    }
  };

  /** 팀 설정 페이지로 이동 */
  const handleSetTeamClick = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/send-confirmation-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data.message);
      alert('메일이 발송되었습니다. 확인해주세요.'); // 성공 시 알림창 표시
    } catch (error) {
      console.log(error);
      alert('메일을 전송하는데 실패했습니다. 다시 시도해주세요.'); // 실패 시 메시지 설정
    }
  };

  /** 비밀번호 확인 */
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(e.target.value);
  };

  /** "내 정보 변경" 버튼 클릭 시 수정 가능하게 설정 */
  const handleEditClick = () => {
    setIsEditable(true);
  };

  /** "취소" 버튼 클릭 시 수정 불가능하게 설정 */
  const handleCancelClick = () => {
    setIsEditable(false);
    setPassword('');
    setPasswordConfirm('');
  };

  // 저장 버튼 눌렀을 때, (아바타, 비밀번호) 데이터 전송하기
  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // FormData를 사용해 파일과 데이터를 보낼 준비
    const formData = new FormData();
    if (selectedFile) formData.append('avatar', selectedFile);
    if (password) formData.append('password', password);

    try {
      // JWT 토큰 설정 (예시로 로컬 스토리지에서 가져옴)
      const token = localStorage.getItem('token');

      const response = await axios.put(`/users/update/:userId`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 추가
          'Content-Type': 'multipart/form-data', // multipart/form-data 설정
        },
      });

      alert(response.data.message); // 성공 메시지 알림
      onClose(); // 창 닫기
    } catch (error) {
      console.error('Error:', error);
      alert('정보 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2
          className="text-darkgray flex items-end justify-end text-[13px] font-regular mb-4 cursor-pointer"
          onClick={onClose} // X 버튼을 클릭하면 onClose 호출
        >
          X
        </h2>

        {/* 프로필 사진 수정 */}
        <div
          className={`w-24 h-24 rounded-full border flex items-center justify-center relative mx-auto ${isEditable ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={handleImageClick}
        >
          <img
            src={basicProfileImage}
            alt="basic_profile_image"
            className="w-full h-full rounded-full"
          />
          {isEditable && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />

        <p className="flex items-center justify-center mt-2 text-sm text-gray-600">
          {user?.email || 'example@gmail.com'}
        </p>

        <form className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-softgray">
              이름
            </label>
            <div className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none">
              {user?.name || '이름'}
            </div>
          </div>

          {/* 소속 팀 */}
          <div>
            <label className="block text-sm font-medium text-softgray">
              소속
            </label>
            <div className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none">
              {user?.team ? (
                user.team
              ) : (
                <button
                  type="button"
                  className="text-blue-500 underline"
                  onClick={handleSetTeamClick} // 버튼 클릭 시 /set-team 페이지로 이동
                >
                  소속팀 정하기
                </button>
              )}
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-softgray">
              비밀번호
            </label>
            <input
              type="password"
              className={`mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none ${
                isEditable ? 'bg-white' : 'bg-gray-100'
              }`}
              placeholder="기존 비밀번호"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              disabled={!isEditable} // isEditable이 false면 입력 불가
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-softgray">
              비밀번호 확인
            </label>
            <input
              type="password"
              className={`mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none ${
                isEditable ? 'bg-white' : 'bg-gray-100'
              }`}
              placeholder="다시 한번 입력해주세요."
              value={passwordConfirm}
              onChange={handleConfirmPasswordChange}
              disabled={!isEditable} // isEditable이 false면 입력 불가
            />
            {password && passwordConfirm && password === passwordConfirm && (
              <FaCheckCircle className="absolute right-3 top-9 text-green-500" />
            )}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {isEditable ? (
              <>
                <button
                  type="button"
                  className="py-2 px-4 border-[1px] border-primary rounded-lg shadow-sm font-bold text-sm text-primary hover:bg-gray-50"
                  onClick={handleCancelClick} // 취소 버튼 클릭 시 handleCancelClick 호출
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-primary text-white rounded-lg shadow-sm font-bold text-sm hover:bg-secondary"
                  onClick={handleSaveClick}
                >
                  저장
                </button>
              </>
            ) : (
              <button
                type="button"
                className="py-2 px-4 bg-primary text-white rounded-lg shadow-sm font-bold text-sm hover:bg-secondary"
                onClick={handleEditClick} // "내 정보 변경" 버튼 클릭 시 handleEditClick 호출
              >
                내 정보 변경
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
