import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logos/todolo_logo_noslog.png';
import useUserStore from '../../store/useUserstore';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져옴
  const isAuthenticated = useUserStore((state) => state.isAuthenticated); // 로그인 상태 관리
  const logout = useUserStore((state) => state.logout);
  /**로고 이미지 클릭 시 홈 화면으로 이동 */
  const handleLogoClick = () => {
    navigate('/');
  };
  const handleLoginButtonClick = () => {
    if (isAuthenticated) {
      // 로그아웃 로직
      logout();
      alert('로그아웃 되었습니다.');
      navigate('/');
    } else {
      // 로그인 페이지로 이동
      navigate('/login');
    }
  };

  const handleMyPageClick = () => {
    navigate('/myPage');
  };

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  return (
    <div className="fixed top-0 left-0 flex justify-between items-center w-full h-10 px-8 border-b border-gray-200 bg-white shadow-sm z-50 ">
      <img
        src={logo}
        alt="Logo"
        className="w-24 h-6 cursor-pointer"
        onClick={handleLogoClick}
      />
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <>
            <button
              className={`text-sm hover:text-primary ${
                location.pathname === '/myPage'
                  ? 'text-primary font-bold'
                  : 'text-darkgray'
              }`}
              onClick={handleMyPageClick}>
              My Page
            </button>
            <button
              className={`text-sm hover:text-primary ${
                location.pathname === '/calendar'
                  ? 'text-primary font-bold'
                  : 'text-darkgray'
              }`}
              onClick={handleCalendarClick}>
              Calendar
            </button>
          </>
        )}
        <button
          className="text-sm text-darkgray hover:text-primary"
          onClick={handleLoginButtonClick}>
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
