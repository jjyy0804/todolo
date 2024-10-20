import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logos/todolo_logo_noslog.png';
import useScheduleStore from '../../store/useScheduleStore';
import useUserStore from '../../store/useUserstore';
import { showSuccessToast } from '../../utils/toast';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져옴
  const isAuthenticated = useUserStore((state) => state.isAuthenticated); // 로그인 상태 관리
  const logout = useUserStore((state) => state.logout);
  const { clearSchedules } = useScheduleStore();
  /** 로고 이미지 클릭 시, 토큰이 있으면 메인 페이지로 이동, 없으면 홈 화면으로 이동 */
  const handleLogoClick = () => {
    const token = localStorage.getItem('accessToken'); // 토큰 가져오기

    if (token) {
      navigate('/main'); // 토큰이 있으면 메인 페이지로 이동
    } else {
      navigate('/'); // 토큰이 없으면 홈 화면으로 이동
    }
  };
  const handleLoginButtonClick = () => {
    if (isAuthenticated) {
      // 로그아웃 로직
      logout();
      localStorage.removeItem('accessToken');
      useScheduleStore.getState().clearSchedules(); // 상태 초기화
      showSuccessToast('로그아웃 되었습니다.');
      navigate('/');
    } else {
      // 로그인 페이지로 이동
      navigate('/login');
    }
  };

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  return (
    <div className="fixed top-0 left-0 flex justify-between items-center w-full h-11 px-8 border-b border-gray-200 bg-white shadow-sm z-50 ">
      <img
        src={logo}
        alt="Logo"
        className="w-24 h-6 cursor-pointer"
        onClick={handleLogoClick}
      />
      <div className="flex items-center gap-5">
        {isAuthenticated && (
          <>
            <button
              className={`text-sm hover:text-primary ${
                location.pathname === '/calendar'
                  ? 'text-primary'
                  : 'text-darkgray'
              }`}
              onClick={handleCalendarClick}
            >
              Calendar
            </button>
          </>
        )}
        <button
          className="text-sm text-darkgray hover:text-primary"
          onClick={handleLoginButtonClick}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
