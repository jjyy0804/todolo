import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserstore';
interface UserInfomationProps {
  name: string;
  email: string;
  password: string;
  team: string;
  team_id : string;
}

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser); //유저 정보 저장

  const login = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
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
          team: data.data.team.team,
          team_id: data.data.team._id,
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
