import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import RequestResetPassword from './RequestResetPassword';

export default function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [message, setMessage] = useState('');
  // const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {}, [token]);

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(e.target.value);
  };

  const handleCancleButtonClick = () => {
    navigate('/');
  };

  const handleChangeButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/users/reset-password/:${token}`, {
        password: password,
      });
      console.log(response.data.message);
      setMessage('비밀번호 재설정되었습니다.');
      // 재설정 후 로그인페이지로 페이지 변경
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error requesting reset password :', error);
      setMessage('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return token ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="block text-sm font-medium text-softgray mb-10">{message}</p>
      <div className="mb-10">
        <label className="text-sm font-medium text-softgray">비밀번호</label>
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
          onClick={handleChangeButtonClick}
        >
          변경하기
        </button>
      </div>
    </div>
  ) : (
    <RequestResetPassword />
  );
}
