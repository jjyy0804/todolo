import React, { useState } from 'react';
import NavigationBar from './common/NavigationBar';
import basicProfileImage from '../assets/images/basic_user_profile.png';
import teamImg from '../assets/icons/team.png';
import todoImg from '../assets/icons/todo.png';
import inProgressImg from '../assets/icons/inProgress.png';
import completedImg from '../assets/icons/completed.png';

import UserInfoModal from './common/UserInfoModal';

export default function MyPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex justify-center itmes-center h-screen p-10">
      <NavigationBar />

      {/* 왼쪽 섹션 (섹션 1, 섹션 2) */}
      <div className="flex flex-col w-3/5 space-y-4 mt-16 ml-20">
        {/* 섹션 1: 프로필, 프로젝트 셀렉트박스 */}
        <div className="p-4 rounded-lg h-3/5 flex flex-row justify-center gap-8 items-center">
          <img
            src={basicProfileImage}
            alt="Profile"
            className="w-[224px] h-[224px] rounded-full"
          />
          <div>
            <h2 className="text-[30px] font-bold">이주영</h2>
            <p className="text-[20px]"> 2팀 </p>
            <p className="text-[17px]"> elice@elice.net </p>
            <a
              href="#"
              onClick={openModal}
              className="text-primary text-[17px]"
            >
              내정보변경
            </a>
          </div>

          {/* 프로젝트 셀렉트박스 */}
          <div className="flex flex-col mb-10">
            <label className="block">나의 프로젝트</label>
            <select className="mt-1 block w-[240px] h-[40px] p-2 border border-gray-300 rounded-lg">
              <option>project1</option>
              <option>project2</option>
              <option>project3</option>
              <option>project4</option>
            </select>
          </div>
        </div>

        {/* 섹션 2: 프로젝트별 팀원 컨테이너 */}
        <div className="bg-third p-2 shadow-lg rounded-lg h-2/5 flex flex-col">
          {/* Team Members 텍스트 */}
          <div className="flex flex-row">
            <img
              src={teamImg}
              alt="Team Icon"
              className="w-[20px] h-[20px] mr-1 mb-0"
            />
            <h2 className="text-[13px]">Team Members</h2>
          </div>

          <div className="flex h-full w-[700px] overflow-x-auto">
            {/* 프로젝트별 팀원을 보여주는 각각의 박스들 */}
            <div className="flex h-full">
              <div className="bg-white p-4 mb-2 mt-1 mr-4 rounded-lg shadow w-[150px]"></div>
              <div className="bg-white p-4 mb-2 mr-4 mt-1 rounded-lg shadow w-[150px]"></div>
              <div className="bg-white p-4 mb-2 mr-4 mt-1 rounded-lg shadow w-[150px]"></div>
              <div className="bg-white p-4 mb-2 mr-4 mt-1 rounded-lg shadow w-[150px]"></div>
              <div className="bg-white p-4 mb-2 mr-4 mt-1 rounded-lg shadow w-[150px]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 섹션 (섹션 3) */}
      <div className="flex flex-col w-2/5 p-0 ml-12 rounded-lg mt-16 mr-20">
        {/* Todo 박스 */}
        <div className="bg-third p-2 mb-5 rounded-lg shadow-lg h-1/3">
          {/* Todo 텍스트 */}
          <div className="flex flex-row">
            <img
              src={todoImg}
              alt="Todo Icon"
              className="w-[20px] h-[20px] mr-1"
            />
            <h3 className="text-[13px] font-regular">Todo</h3>
          </div>

          <div className="flex-col w-full h-[170px] overflow-y-auto">
            {/* Todo 박스 안, task들 */}
            <div className="bg-white p-4 mb-2 mt-1 mr-2 rounded-lg shadow-lg h-[70px]"></div>
            <div className="bg-white p-4 mb-2 mr-2 rounded-lg shadow h-[70px]"></div>
            <div className="bg-white p-4 mb-2 mr-2 rounded-lg shadow h-[70px]"></div>
            <div className="bg-white p-4 mb-2 mr-2 rounded-lg shadow h-[70px]"></div>
          </div>
        </div>

        {/* In progress 박스 */}
        <div className="bg-third p-2 mb-5 rounded-lg shadow-lg h-1/3">
          <div className="flex flex-row">
            <img
              src={inProgressImg}
              alt="InProgress Icon"
              className="w-[20px] h-[20px] mr-1"
            />
            <h3 className="text-[13px] font-regular">In Progress</h3>
          </div>
        </div>

        {/* completed 박스 */}
        <div className="bg-third p-2 m-0 rounded-lg shadow-lg h-1/3">
          <div className="flex flex-row">
            <img
              src={completedImg}
              alt="Completed Icon"
              className="w-[20px] h-[20px] mr-1"
            />
            <h3 className="text-[13px] font-regular">Completed</h3>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <UserInfoModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
