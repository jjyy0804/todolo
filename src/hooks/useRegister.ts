import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UseRegisterProps {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  team: string;
  profileImage: string;
  basicProfileImage: string;
}

const useRegister = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleRegisterClick = async ({
    name,
    email,
    password,
    passwordConfirm,
    team,
    profileImage,
    basicProfileImage,
  }: UseRegisterProps) => {
    // 유효성 검사
    if (!name || !email || !password || !passwordConfirm || !team) {
      setErrorMessage('모든 필드를 입력해 주세요.');
      return;
    }

    // 이메일 형식 확인 (간단한 정규식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('유효한 이메일 주소를 입력해 주세요.');
      return;
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 서버 전송 폼 데이터
      const formData = {
        name,
        email,
        password,
        team,
        avatar: profileImage === basicProfileImage ? '' : profileImage, // 기본 이미지일 경우 빈 문자열로 설정
      };
      const response = await axios.post(
        'http://localhost:3000/users/register',
        formData,
      );

      if (response.status === 200) {
        alert('회원가입이 완료되었습니다!');
        setErrorMessage(''); // 성공 시 오류 메시지 초기화
        navigate('/main');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      setErrorMessage('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return { errorMessage, handleRegisterClick };
};

export default useRegister;
