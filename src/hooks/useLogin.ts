import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserstore';
interface UserInfomationProps {
  name: string;
  email: string;
  password: string;
  team: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser); //유저 정보 저장

  const login = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
    // 유효성 검사
    if (!email || !password) {
      setErrorMessage('모든 필드를 입력해 주세요.');
      return;
    }

    // 이메일 형식 확인 (간단한 정규식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('유효한 이메일 주소를 입력해 주세요.');
      return;
    }

    // 비밀번호 형식 검사: 특수문자 포함 여부 및 10자 이내 제한
    const passwordRegex =
      /^(?=.*[!@#$%^&*()_\-+=])[a-zA-Z0-9!@#$%^&*()_\-+=]{1,10}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('비밀번호는 특수문자를 포함하고 10자 이내여야 합니다.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        email,
        password,
      });
      //로그인 성공 시
      if (response.status === 200) {
        const data = response.data;
        // 로그인 성공 시 사용자 정보 및 토큰 저장
        localStorage.setItem('accessToken', data.accessToken);
        // 서버에서 받아온 사용자 정보를 상태관리
        setUser({
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar,
          team: data.data.team,
        });
        navigate('/main');
      }
    } catch (err: any) {
      console.error('로그인 오류:', err);
      setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, errorMessage };
};
export default useLogin;
