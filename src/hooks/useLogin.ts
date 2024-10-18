import apiClient from '../utils/apiClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserstore';
interface UserInfomationProps {
  name: string;
  email: string;
  password: string;
  team: string;
  team_id: string;
}

const useLogin = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const login = async (email: string, password: string) => {
    const { user, setUser, setLoading } = useUserStore.getState();
    setErrorMessage('');
    try {
      setLoading(true);
      const response = await apiClient.post(`/api/users/login`, {
        email,
        password,
      });
      //로그인 성공 시
      if (response.status === 200) {
        const data = response.data;
        // 로그인 성공 시 사용자 정보 및 토큰 저장
        localStorage.setItem('accessToken', data.accessToken);

        // // refreshToken 쿠키에 저장 --보통 back에서 함
        // document.cookie = `refreshToken=${data.refreshToken}; path=/; Secure; HttpOnly; SameSite=Strict`;

        // 서버에서 받아온 사용자 정보를 상태관리
        setUser({
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar,
          team: data.data.team?.team || '', // team이 없으면 빈 문자열 사용
          team_id: data.data.team?._id || '', // team_id가 없으면 빈 문자열 사용
        });
        console.log(data.data);
        alert('로그인 성공');
        navigate('/main');
      }
    } catch (err: any) {
      if (err.response) {
        // 서버로부터 응답이 있는 경우 (로그인 실패)
        if (err.response.status === 401) {
          setErrorMessage('이메일 또는 비밀번호가 틀립니다.');
        } else {
          setErrorMessage(
            `오류: ${err.response.data.message || '문제가 발생했습니다.'}`,
          );
        }
      } else {
        // 네트워크 오류 또는 서버로부터 응답이 없는 경우
        setErrorMessage('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }

      console.error('로그인 오류:', err);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return { login, errorMessage };
};
export default useLogin;
