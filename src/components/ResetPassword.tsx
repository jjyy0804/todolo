import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import apiClient from '../utils/apiClient';
import Loading from './Loading';
import { ROUTE_LINK } from '../routes/routes';
import logo from '../assets/logos/todolo_logo_main.png';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('비밀번호를 재설정 해주세요');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage('입력하신 이메일의 링크를 확인해 주세요.');
      setDisabled(true);
      setTimeout(() => {
        navigate(ROUTE_LINK.REQ_RESET_PASSWORD.link);
      }, 2000);
    }
  }, [token, navigate]);

  useEffect(() => {
    // Enable the button only when both passwords are valid and matching
    if (
      password &&
      passwordConfirm &&
      password === passwordConfirm &&
      !errorMessage
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password, passwordConfirm, errorMessage]);

  const checkValidPassword = () => {
    const passwordRegex =
      /^(?=.*[!@#$%^&*()_\-+=])[a-zA-Z0-9!@#$%^&*()_\-+=]{1,10}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('비밀번호는 특수문자를 포함하고 10자 이내여야 합니다.');
    } else {
      setErrorMessage('');
    }
  };

  const checkPassword = () => {
    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
    } else if (!errorMessage) {
      setDisabled(false); // Allow password reset if passwords match
    }
  };

  const handleCancleButtonClick = () => {
    navigate(ROUTE_LINK.REQ_RESET_PASSWORD.link);
  };

  const handleChangeButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.put(`api/users/reset-pw/`, {
        token: token,
        newPassword: password,
      });
      console.log(response.data.message);
      setMessage('비밀번호 재설정되었습니다.');
      // 재설정 후 로그인 페이지로 이동
      setTimeout(() => {
        window.close();
      }, 3000);
    } catch (error) {
      console.error('Error requesting reset password :', error);
      setMessage('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return token ? (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-[700px] h-[500px] p-6 bg-white shadow-lg rounded-[10px]">
        <img src={logo} alt="logo" className="mb-1 w-[364px] h-[118px]" />
        <p className="mb-6 text-primary text-[16px] font-bold">{message}</p>

        <div className="mb-4">
          <label className="text-sm font-medium text-softgray">
            새 비밀번호
          </label>
          <input
            type="password"
            className="mt-1 block w-full border border-softgray rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
            placeholder="비밀번호"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            onBlur={checkValidPassword}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordConfirm(e.target.value)
            }
            onBlur={checkPassword}
          />
          {password && passwordConfirm && password === passwordConfirm && (
            <FaCheckCircle className="absolute right-3 top-9 text-green-500" />
          )}
        </div>

        <p className="block text-sm font-medium text-softgray mt-3 mb-0">
          {errorMessage}
        </p>

        <div className="flex justify-center gap-4 mt-5">
          <button
            type="button"
            className="py-2 px-4 border-2 border-primary rounded-lg shadow-sm text-sm text-primary hover:bg-hoversecondary"
            onClick={handleCancleButtonClick}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={disabled}
            className="py-2 px-4 bg-primary text-white rounded-lg shadow-sm text-sm disabled:bg-softgray hover:bg-hoverprimary"
            onClick={handleChangeButtonClick}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
