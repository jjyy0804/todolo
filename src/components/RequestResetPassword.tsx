import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import React, { useState } from 'react';
import { ROUTE_LINK } from '../routes/routes';
import logo from '../assets/logos/todolo_logo_main.png';

export default function RequestResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    '비밀번호를 재설정하고자 하는 todolo계정의 이메일을 입력해주세요.',
  );
  const navigate = useNavigate();
  const handleRequestButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.post(
        `api/users/request-password-reset`,
        {
          email: email,
        },
      );
      console.log(response.data.message);
      setMessage(
        '비밀번호 재설정 링크가 이메일로 발송되었습니다.\n이메일 확인 바랍니다.',
      );

      setTimeout(() => {
        navigate(ROUTE_LINK.LOGIN.link);
      }, 3000);
    } catch (error) {
      console.error('Error requesting reset password :', error);
      setMessage(
        '비밀번호 재설정 요청에 실패했습니다. 입력하신 이메일 주소를 확인바랍니다.',
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/** 요소 담는 흰색 컨테이너 박스 */}
      <div className="flex flex-col items-center justify-center w-[700px] h-[500px] p-6 bg-white shadow-lg rounded-[10px]">
        <img src={logo} alt="logo" className="mb-8 w-[364px] h-[118px]" />
        <div>
          <p className="block text-sm font-medium text-softgray mb-3">
            {message}
          </p>
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
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="submit"
            className="py-2 px-4 bg-primary text-white rounded-lg shadow-sm text-sm hover:bg-secondary"
            onClick={handleRequestButtonClick}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
