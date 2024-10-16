import axios from 'axios';
import React, { useState } from 'react';

export default function RequestResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    '비밀번호를 재설정하고자 하는 todolo계정의 이메일을 입력해주세요.',
  );

  const handleRequestButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/request-password-reset`,
        {
          email: email,
        },
      );
      console.log(response.data.message);
      setMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다.');
    } catch (error) {
      console.error('Error requesting reset password :', error);
      setMessage('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        <p className="block text-sm font-medium text-softgray mb-10">
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
  );
}
