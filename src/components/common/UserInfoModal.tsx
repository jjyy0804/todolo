import React, { useState, useRef } from 'react';
import basicProfileImage from '../../assets/images/basic_user_profile.png';
import { FaCheckCircle } from 'react-icons/fa';

// props 타입 정의
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  if (!isOpen) return null;

  const [profileImage, setProfileImage] = useState(basicProfileImage);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // useRef로 파일 인풋을 참조

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isEditable, setIsEditable] = useState(false); // 프로필 이미지 및 비밀번호 수정 가능 여부

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
            src={profileImage}
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
          elicetrack99@gmail.com
        </p>

        <form className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-softgray">
              이름
            </label>
            <div className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none">
              이주영
            </div>
          </div>

          {/* 소속 팀 */}
          <div>
            <label className="block text-sm font-medium text-softgray">
              소속
            </label>
            <div className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none">
              2팀
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
              placeholder="*******(기존비번)"
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
                  onClick={onClose}
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
