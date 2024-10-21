import React, { useState } from 'react';
import logo from '../assets/logos/todolo_logo_main.png';
import useLogin from '../hooks/useLogin';
import useUserStore from '../store/useUserstore';

export default function Login() {
  // 인풋값 입력시, 색상 변경하기
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 훅에서 로딩 및 에러 상태, 로그인 함수 가져오기
  const { login, errorMessage } = useLogin();
  const { isLoading, user } = useUserStore(); //서버로 요청 보낼 때는 버튼 비활성화
  /** 로그인 버튼 클릭*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center relative">
      <img src={logo} alt="todolo" className="mb-4 w-[461px] h-[135px]" />
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        {/* 이메일 인풋 박스 */}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => {
            setEmailFocused(true);
            if (!email) setEmail(''); // 포커스 시 초기값 설정
          }}
          onBlur={() => setEmailFocused(false)}
          required
          className={`p-[20px_16px] w-[464px] h-[62px] border border-[#8F97A9] rounded-[10px] mb-4 ${emailFocused ? 'text-black' : 'text-[#757575]'
            }`}
        />
        {/* 비밀번호 인풋 박스 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => {
            setPasswordFocused(true);
            if (!email) setPassword(''); // 포커스 시 초기값 설정
          }}
          onBlur={() => setPasswordFocused(false)}
          required
          className={`p-[20px_16px] w-[464px] h-[62px] border border-[#8F97A9] rounded-[10px] mb-4 ${passwordFocused ? 'text-black' : 'text-[#757575]'
            }`}
        />
        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="p-[18px-20px] w-[464px] h-[56px] bg-[#599BFF] border rounded-[10px] text-white font-bold"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        {/* 오류 메시지 표시 */}
        {errorMessage && (
          <p className="text-red-500 mt-2">
            이메일 혹은 비밀번호가 틀렸습니다.
          </p>
        )}

        {/* 로그인 밑에 회원가입, 아이디, 비밀번호 찾기 */}
        <div className="w-[267px] h-[20px] mt-4 text-[#757575] text-center flex justify-between">
          <a href="/register">회원가입</a>/
          <a href="/req-reset-pw">비밀번호찾기</a>
        </div>
      </form>
    </div>
  );
}
