import React, { useState } from 'react';
import logo from '../assets/logos/todolo_logo_main.png';
import apiClient from '../utils/apiClient';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTE_LINK } from '../routes/routes';
import NavigationBar from './common/NavigationBar';

export default function SetTeam() {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [message, setMessage] = useState('');

  const { token } = useParams();
  const navigate = useNavigate();

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(event.target.value);
  };

  const sendHandleClick = async () => {
    try {
      const response = await apiClient.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/confirm-team`,
        {
          token: token,
          team: selectedTeam,
        },
      );
      console.log(response.data.message);
      setMessage('팀이 변경되었습니다.');
      // 재설정 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate(ROUTE_LINK.LOGIN.link);
      }, 2000);
    } catch (error) {
      console.error('Error confirming team change:', error);
      setMessage('팀 변경에 실패했습니다. 다시 시도해주세요.');
      // 실패 후 메인 페이지로 이동
      setTimeout(() => {
        navigate(ROUTE_LINK.LOGIN.link);
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <NavigationBar />
      <div className="flex flex-col items-center justify-center w-[700px] h-[500px] p-6 bg-white shadow-lg rounded-[10px]">
        <img src={logo} alt="logo" className="mb-1 w-[364px] h-[118px]" />
        <p className="mb-0 text-primary text-[16px] font-bold">
          현재 소속된 팀이 없습니다
        </p>
        <p className="mb-10 text-primary text-[16px] font-bold">
          팀을 선택해주세요
        </p>
        <select
          value={selectedTeam}
          onChange={handleTeamChange}
          className="w-80 h-10 px-3 py-2 mb-3 text-center text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>
            팀을 선택해주세요.
          </option>
          <option value="1팀">1팀</option>
          <option value="2팀">2팀</option>
          <option value="3팀">3팀</option>
          <option value="4팀">4팀</option>
        </select>

        {/* 성공 또는 실패 시 메시지 표시 */}
        {message && (
          <div className="mt-1 text-center text-sm text-red-500 mb-4 ">
            {message}
          </div>
        )}

        <button
          className={`px-6 py-2 text-white font-semibold bg-primary rounded-lg transition-opacity duration-300 ${
            selectedTeam
              ? 'opacity-100 hover:bg-[#257ADA]'
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!selectedTeam}
          onClick={sendHandleClick}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}
