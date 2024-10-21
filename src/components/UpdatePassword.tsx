import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import axios from 'axios';
import logo from '../assets/logos/todolo_logo_main.png';

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const currentPasswordRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);

  const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] = useState<
    boolean | null
  >(null); // null for no validation, true for correct, false for incorrect
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null); // null for no validation, true for match, false for no match
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    // Enable the button only when both passwords are valid and matching
    if (
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      !message
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [newPassword, confirmPassword, message]);

  const checkValidPassword = () => {
    const passwordRegex =
      /^(?=.*[!@#$%^&*()_\-+=])[a-zA-Z0-9!@#$%^&*()_\-+=]{1,10}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage('비밀번호는 특수문자를 포함하고 10자 이내여야 합니다.');
    } else {
      setMessage('');
    }
  };

  const checkPassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
    } else if (!message) {
      setDisabled(false); // Allow password reset if passwords match
    }
  };

  const handleChangePassword = async () => {
    setIsCurrentPasswordCorrect(null);
    setIsPasswordMatch(null);
    setMessage('');

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await apiClient.post(
        '/users/update-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setMessage('비밀번호가 정상적으로 변경되었습니다.');
        navigate('/main');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage('입력하신 현재 비밀번호가 일치하지 않습니다.');
        setCurrentPassword('');
        if (currentPasswordRef.current) {
          currentPasswordRef.current.focus();
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
      setIsCurrentPasswordCorrect(false);
    }
  };

  const handleCancel = () => {
    navigate('/main');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-[700px] h-[600px] p-6 bg-white shadow-lg rounded-[10px]">
        <img src={logo} alt="logo" className="mb-1 w-[364px] h-[118px]" />
        <p className="mb-6 text-primary text-[16px] font-bold">
          비밀번호를 재설정 해주세요
        </p>
        <div className="mb-4 space-y-4 ">
          <div>
            <label className="block text-sm font-medium text-softgray">
              현재비밀번호
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
              ref={currentPasswordRef}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="비밀번호"
            />
            {isCurrentPasswordCorrect === false && (
              <p style={{ color: 'red' }}>Current password is incorrect</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-softgray">
              새 비밀번호
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
              ref={newPasswordRef}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-softgray">
              비밀번호 확인
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 확인"
            />
            {isPasswordMatch === false && (
              <p className="block text-sm font-medium text-softgray mb-10">
                비밀번호가 일치하지 않습니다
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            className="py-2 px-4 border-2 border-primary rounded-lg shadow-sm text-sm text-primary hover:bg-gray-50"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className="py-2 px-4 bg-primary text-white rounded-lg shadow-sm text-sm hover:bg-secondary"
            disabled={disabled}
            onBlur={checkPassword}
          >
            변경하기
          </button>
        </div>
        <p className="block text-sm font-medium text-softgray mt-3 mb-0">
          {message}
        </p>
      </div>
    </div>
  );
}
