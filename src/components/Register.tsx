import React, { useState } from 'react';
import NavigationBar from './common/NavigationBar';
import basicProfileImage from '../assets/images/basic_user_profile.png';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useRegisterUser from '../hooks/useRegisterUser';

export default function Register() {
  const [profileImage, setProfileImage] = useState(basicProfileImage);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { errorMessage, register } = useRegisterUser();

  const navigate = useNavigate();

  /**파일 선택 시  profileImage의 상태를 해당 url로 변경*/
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  /**프로필 이미지 클릭 시 파일 선택 가능 */
  const handleImageClick = () => {
    document.getElementById('fileInput')?.click();
  };
  /**비밀번호 확인 */
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(e.target.value);
  };
  /**회원가입 페이지에서 취소 시 */
  const handleCancleButtonClick = () => {
    navigate('/');
  };

  /**회원가입하기 버튼 클릭 시 */
  const handleRegisterButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();
    //useRegister() 커스텀 훅에서 서버로 전송
    await register({
      name,
      email,
      password,
      passwordConfirm,
      profileImage,
      basicProfileImage,
    });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-8">
        <h2 className="text-3xl font-medium text-center mb-6 text-darkgray">
          Sign Up
        </h2>

        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 rounded-full border flex items-center justify-center relative cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={profileImage}
              alt="basic_profile_image"
              className="w-full h-full rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
          </div>
          <label className="mt-2 text-sm text-gray-600">프로필 사진</label>
          <input
            disabled
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-softgray">
              이름
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
              placeholder="이름"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-softgray">
              이메일
            </label>
            <input
              type="email"
              className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
              placeholder="이메일"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-softgray">
              비밀번호
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
              placeholder="비밀번호"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-softgray">
              비밀번호 확인
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={handleConfirmPasswordChange}
            />
            {password && passwordConfirm && password === passwordConfirm && (
              <FaCheckCircle className="absolute right-3 top-9 text-green-500" />
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              className="py-2 px-4 border-2 border-primary rounded-lg shadow-sm text-sm text-primary hover:bg-gray-50"
              onClick={handleCancleButtonClick}
            >
              취소
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-primary text-white rounded-lg shadow-sm text-sm hover:bg-secondary"
              onClick={handleRegisterButtonClick}
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
