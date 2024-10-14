import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import NavigationBar from './common/NavigationBar';
import todoImg from '../assets/icons/todo.png';
import inProgressImg from '../assets/icons/inProgress.png';
import completedImg from '../assets/icons/completed.png';
import glassImg from '../assets/icons/magnifyingglass.png';
import ScheduleModal from './common/modal/ScheduleModal';
import useUserStore from '../store/useUserstore';
import useScheduleStore from '../store/useScheduleStore';
import UserInfoModal from './common/UserInfoModal';

export default function Board() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null); // 수정할 일정
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 여부

  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // schedule 모달

  const openUserInfoModal = () => setIsUserInfoModalOpen(true);
  const closeUserInfoModal = () => setIsUserInfoModalOpen(false);

  const { user } = useUserStore();
  const { schedules } = useScheduleStore();
  useEffect(() => {
    console.log(schedules);
  }, [schedules]);
  // 프로젝트 및 사용자 필터링 하는 로직 추가 (API도 받아오기)
  const openScheduleModal = (schedule: any | null) => {
    setSelectedSchedule(schedule);
    setIsEdit(!!schedule); // 일정이 있으면 수정 모드로 전환
    setIsModalOpen(true);
  };
  const closeScheduleModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null); // 모달 닫을 때 데이터 초기화
    setIsEdit(false); // 수정 모드 초기화
  };
  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col w-screen h-screen bg-white">
        {/* 사용자 정보 (프로필사진, 이름, 소속팀) */}
        <div className="flex items-start space-x-2 mt-12 ml-2 mb-4">
          <img
            src={user?.avatar}
            alt="Profile_Img"
            className="w-[40px] h-[40px] rounded-full cursor-pointer"
            onClick={openUserInfoModal}
          />
          <div>
            <h4 className="text-[17px] font-regular mt-2">
              {user?.name} ({user?.team})
            </h4>
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
              {/* todo 보드 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <img
                    src={todoImg}
                    alt="Todo Icon"
                    className="w-[25px] h-[25px] mr-1 mb-2"
                  />
                  <h3 className="text-[17px] font-regular mb-2">Todo</h3>
                </div>
                {/*상태 = "할 일" 인 일정 카드 */}
                <div className="w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg overflow-y-auto flex flex-col justify-between">
                  <div className="p-4 flex flex-col space-y-4">
                    {schedules.length > 0 ? (
                      schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex justify-between bg-white p-2 rounded-md shadow-md text-darkgray"
                        >
                          <div>
                            <h4 className="font-bol">
                              {schedule.scheduleName}
                            </h4>
                            <p className="text-sm">{schedule.projectName}</p>
                            <p className="text-sm">
                              우선순위 {schedule.priority}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-red-500">
                              <FiTrash2 size={20} />
                            </button>
                            <button className="text-gray-400 hover:text-blue-500">
                              <FiEdit3
                                size={20}
                                onClick={() => openScheduleModal(schedule)}
                              />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>현재 진핼 할 일정이 없습니다.</p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="w-[302px] h-[51px] bg-primary text-white font-bold px-4 py-2 rounded-[56px] hover:bg-[#257ADA] transition-colors ease-linear mb-3"
                      onClick={() => openScheduleModal(null)}
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              </div>
              {/* In Progress 보드 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <img
                    src={inProgressImg}
                    alt="InProgress Icon"
                    className="w-[25px] h-[25px] mr-1 mb-2"
                  />
                  <h3 className="text-[17px] font-regular mb-2">In Progress</h3>
                </div>
                {/*상태 = "진행 중"인 일정 카드 */}
                <div className="overflow-y-auto w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg">
                  <div className="p-4 flex flex-col space-y-4">
                    {schedules.length > 0 ? (
                      schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex justify-between bg-white p-2 rounded-md shadow-md text-darkgray"
                        >
                          <div>
                            <h4 className="font-bol">
                              {schedule.scheduleName}
                            </h4>
                            <p className="text-sm">{schedule.projectName}</p>
                            <p className="text-sm">
                              우선순위 {schedule.priority}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-red-500">
                              <FiTrash2 size={20} />
                            </button>
                            <button className="text-gray-400 hover:text-blue-500">
                              <FiEdit3
                                size={20}
                                onClick={() => openScheduleModal(schedule)}
                              />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>현재 진행 중인 일정이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
              {/* completed 보드 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <img
                    src={completedImg}
                    alt="Completed Icon"
                    className="w-[25px] h-[25px] mr-1 mb-2"
                  />
                  <h3 className="text-[17px] font-regular mb-2">Completed</h3>
                </div>
                {/*상태 = "진행 중"인 일정 카드 */}
                <div className="overflow-y-auto w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg">
                  <div className="p-4 flex flex-col space-y-4">
                    {schedules.length > 0 ? (
                      schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex justify-between bg-white p-2 rounded-md shadow-md text-darkgray"
                        >
                          <div>
                            <h4 className="font-bol">
                              {schedule.scheduleName}
                            </h4>
                            <p className="text-sm">{schedule.projectName}</p>
                            <p className="text-sm">
                              우선순위 {schedule.priority}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-red-500">
                              <FiTrash2 size={20} />
                            </button>
                            <button className="text-gray-400 hover:text-blue-500">
                              <FiEdit3
                                size={20}
                                onClick={() => openScheduleModal(schedule)}
                              />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>현재 완료된 일정이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={closeScheduleModal}
        schedule={selectedSchedule}
        isEdit={isEdit}
      />
      {/* UserInfoModal */}
      <UserInfoModal
        isOpen={isUserInfoModalOpen}
        onClose={closeUserInfoModal}
      />
    </div>
  );
}
