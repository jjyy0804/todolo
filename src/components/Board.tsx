import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './common/NavigationBar';
import todoImg from '../assets/icons/todo.png';
import inProgressImg from '../assets/icons/inProgress.png';
import completedImg from '../assets/icons/completed.png';
import basicProfileImage from '../assets/images/basic_user_profile.png'; //나중에 수정
import glassImg from '../assets/icons/magnifyingglass.png';

export default function Board() {
  const [searchTerm, setSearchTerm] = useState('');
  // 프로젝트 및 사용자 필터링 하는 로직 추가 (API도 받아오기)

  return (
    <div className="flex flex-col w-[1440px] h-[1024px] bg-white">
      <NavigationBar />

      {/* 사용자 정보 (프로필사진, 이름, 소속팀) */}
      <div className="flex items-start space-x-2 mt-12 ml-2 mb-4">
        <img
          src={basicProfileImage}
          alt="Profile_Img"
          className="w-[40px] h-[40px] rounded-full"
        />
        <div>
          <h4 className="text-[17px] font-regular mt-2">이주영 (2팀)</h4>
        </div>
      </div>

      {/* 사용자 검색 창 => 나중에 수정필요 */}
      <div className="flex flex-row items-end justify-end space-x-4 mb-4 mr-24">
        <div className="relative w-[343px]">
          {' '}
          {/* 인풋 박스를 감싸는 relative 컨테이너 */}
          <input
            type="text"
            placeholder="프로젝트 및 사용자 이름 검색"
            className="w-[343px] h-[32px] border rounded-[10px] p-2 pl-8 bg-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src={glassImg}
            alt="Search Icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* 메인 컨테이너 */}
        <div className="w-[1259px] h-[846px] bg-[#F5F9FF] shadow-lg rounded-lg p-4 mb-14">
          {/* 텍스트와 보드를 세로로 정렬 */}
          <div className="flex justify-between space-x-4">
            {/* 첫 번째 보드 */}
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <img
                  src={todoImg}
                  alt="Todo Icon"
                  className="w-[25px] h-[25px] mr-1 mb-2"
                />
                <h3 className="text-[17px] font-regular mb-2">Todo</h3>
              </div>
              <div className="w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg p-4 flex flex-col items-center space-y-4">
                <button className="w-[302px] h-[51px] mt-auto bg-[#599BFF] text-white font-bold px-4 py-2 rounded-[56px] hover:bg-blue-600">
                  + ADD
                </button>
              </div>
            </div>
            {/* 두 번째 보드 */}
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <img
                  src={inProgressImg}
                  alt="InProgress Icon"
                  className="w-[25px] h-[25px] mr-1 mb-2"
                />
                <h3 className="text-[17px] font-regular mb-2">In Progress</h3>
              </div>
              <div className="w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg p-4 flex flex-col space-y-4"></div>
            </div>
            {/* 세 번째 보드 */}
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <img
                  src={completedImg}
                  alt="Completed Icon"
                  className="w-[25px] h-[25px] mr-1 mb-2"
                />
                <h3 className="text-[17px] font-regular mb-2">Completed</h3>
              </div>
              <div className="w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg p-4 flex flex-col space-y-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
