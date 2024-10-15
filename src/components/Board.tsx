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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteConfirmModal from './common/modal/DeleteConFirmModal';
import UserInfoModal from './common/UserInfoModal';
import useDeleteTask from '../hooks/task/useDeleteTask';

interface Schedule {
  id: number;
  scheduleName: string;
  projectName: string;
  scheduleContent: string;
  status: '할 일' | '진행 중' | '완료';
  priority: '높음' | '중간' | '낮음';
  teamMembers: TeamMember[];
  startDate: string;
  endDate: string;
}

interface TeamMember {
  id: number;
  name: string;
  avatar?: string;
}

export default function Board() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); // 등록, 수정 모달 상태
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 (프로젝트명, 사용자명)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null); // 수정할 일정
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 여부
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null); // 삭제할 일정
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);  // 유저 정보 모달 상태
  
  const { user } = useUserStore();
  const { schedules, addSchedule, removeSchedule, updateSchedule, setSchedules} = useScheduleStore();

  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>(schedules); //사용자 및 프로젝트 검색

  const openUserInfoModal = () => setIsUserInfoModalOpen(true);
  const closeUserInfoModal = () => setIsUserInfoModalOpen(false);
  const { deleteTask, loading } = useDeleteTask(); //일정 삭제 커스텀 훅
  /**검색어에 따라 일정목록을 재렌더링함 */
  useEffect(() => {
    setFilteredSchedules(
      schedules.filter((schedule) =>
        schedule.projectName.includes(searchTerm) ||
        schedule.teamMembers.some((member) => member.name.includes(searchTerm))
      )
    );
  }, [schedules, searchTerm]);
  console.log(filteredSchedules);

  /** 드래그가 끝났을 때 호출되며, 항목이 드롭된 위치에 맞게 schedules 배열을 업데이트 */
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
  
    // 드롭되지 않은 경우 종료
    if (!destination) return;
  
    // 같은 보드 내 이동 처리
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(
        schedules.filter((schedule) => schedule.status === source.droppableId)
      );
  
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
  
      const updatedSchedules = schedules.map((schedule) =>
        items.find((item) => item.id === schedule.id) || schedule
      );
  
      setSchedules(updatedSchedules);
    } else {
      // 다른 보드로 이동 처리
      const sourceItems = schedules.filter(
        (schedule) => schedule.status === source.droppableId
      );
      const destinationItems = schedules.filter(
        (schedule) => schedule.status === destination.droppableId
      );
  
      const [movedItem] = sourceItems.splice(source.index, 1);
      movedItem.status = destination.droppableId as '할 일' | '진행 중' | '완료';
      destinationItems.splice(destination.index, 0, movedItem);
  
      const updatedSchedules = [
        ...sourceItems,
        ...destinationItems,
        ...schedules.filter(
          (schedule) =>
            schedule.status !== source.droppableId &&
            schedule.status !== destination.droppableId
        ),
      ];
  
      setSchedules(updatedSchedules);
    }
  };
  /**일정을 클릭했을 경우 수정모드, 
  * add 버튼을 클릭했을 경우 등록 모드
  */
  const handleOpenModal = (schedule: Schedule | null) => {
    setSelectedSchedule(schedule);
    setIsEdit(!!schedule); // 일정이 있으면 수정 모드로 전환
    setIsScheduleModalOpen(true);
  };
  /**일정 수정,등록 모달 닫기*/
  const handleModalClose = () => {
    setIsScheduleModalOpen(false);
    setSelectedSchedule(null); // 모달 닫을 때 데이터 초기화
    setIsEdit(false); // 수정 모드 초기화
  };

  /**삭제 모달 열기  */ 
  const openDeleteModal = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteModalOpen(true);
  };

  /**삭제 모달 확인 시 실행*/
  const handleConfirmDelete = () => {
    if (scheduleToDelete) {
      removeSchedule(scheduleToDelete.id)
      deleteTask(scheduleToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  };


  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col w-screen h-screen bg-white overflow-auto">
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
        <div className="flex flex-row items-end justify-end space-x-4 mb-4 mr-36">
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

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col items-center justify-center">
            {/* 메인 컨테이너 */}
            <div className="bg-[#F5F9FF] shadow-lg rounded-lg p-4 mb-14">
              {/* 텍스트와 보드를 세로로 정렬 */}
              <div className="flex justify-between space-x-4">
                {/* todo 보드 */}
                <Droppable droppableId="할 일">
                  {(provided) => (
                    <div
                      className="flex flex-col items-start"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
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
                          {filteredSchedules
                            .filter((schedule) => schedule.status === '할 일')
                            .map((schedule, index) => (
                              <Draggable
                                key={schedule.id}
                                draggableId={schedule.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex justify-between bg-white p-2 rounded-md shadow-md text-darkgray"
                                  >
                                    <div>
                                      <h4 className="font-bol">
                                        {schedule.scheduleName}
                                      </h4>
                                      <p className="text-sm">
                                        {schedule.projectName}
                                      </p>
                                      <p className="text-sm">
                                        우선순위 {schedule.priority}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => openDeleteModal(schedule)}
                                      >
                                        <FiTrash2 size={20} />
                                      </button>
                                      <button className="text-gray-400 hover:text-blue-500">
                                        <FiEdit3
                                          size={20}
                                          onClick={() =>
                                            handleOpenModal(schedule)
                                          }
                                        />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                        <div className="flex justify-center">
                          <button
                            className="w-[302px] h-[51px] bg-primary text-white font-bold px-4 py-2 rounded-[56px] hover:bg-[#257ADA] transition-colors ease-linear mb-3"
                            onClick={() => handleOpenModal(null)}
                          >
                            + ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
                {/* In Progress 보드 */}
                <Droppable droppableId="진행 중">
                  {(provided) => (
                    <div
                      className="flex flex-col items-start"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="flex items-center">
                        <img
                          src={inProgressImg}
                          alt="InProgress Icon"
                          className="w-[25px] h-[25px] mr-1 mb-2"
                        />
                        <h3 className="text-[17px] font-regular mb-2">
                          In Progress
                        </h3>
                      </div>
                      {/*상태 = "진행 중"인 일정 카드 */}
                      <div className="overflow-y-auto w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg">
                        <div className="p-4 flex flex-col space-y-4">
                          {filteredSchedules
                            .filter((schedule) => schedule.status === '진행 중')
                            .map((schedule, index) => (
                              <Draggable
                                key={schedule.id}
                                draggableId={schedule.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex justify-between bg-white p-2 rounded-md shadow-md text-darkgray"
                                  >
                                    <div>
                                      <h4 className="font-bol">
                                        {schedule.scheduleName}
                                      </h4>
                                      <p className="text-sm">
                                        {schedule.projectName}
                                      </p>
                                      <p className="text-sm">
                                        우선순위 {schedule.priority}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => openDeleteModal(schedule)}
                                      >
                                        <FiTrash2 size={20} />
                                      </button>
                                      <button className="text-gray-400 hover:text-blue-500">
                                        <FiEdit3
                                          size={20}
                                          onClick={() =>
                                            handleOpenModal(schedule)
                                          }
                                        />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
                {/* completed 보드 */}
                <Droppable droppableId="완료">
                  {(provided) => (
                    <div
                      className="flex flex-col items-start"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="flex items-center">
                        <img
                          src={completedImg}
                          alt="Completed Icon"
                          className="w-[25px] h-[25px] mr-1 mb-2"
                        />
                        <h3 className="text-[17px] font-regular mb-2">
                          Completed
                        </h3>
                      </div>
                      {/*상태 = "완료"인 일정 카드 */}
                      <div className="overflow-y-auto w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg">
                        <div className="p-4 flex flex-col space-y-4">
                          {filteredSchedules
                            .filter((schedule) => schedule.status === '완료')
                            .map((schedule, index) => (
                              <Draggable
                                key={schedule.id}
                                draggableId={schedule.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex justify-between bg-white p-2 rounded-md shadow-md text-darkgray"
                                  >
                                    <div>
                                      <h4 className="font-bol">
                                        {schedule.scheduleName}
                                      </h4>
                                      <p className="text-sm">
                                        {schedule.projectName}
                                      </p>
                                      <p className="text-sm">
                                        우선순위 {schedule.priority}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => openDeleteModal(schedule)}
                                      >
                                        <FiTrash2 size={20} />
                                      </button>
                                      <button className="text-gray-400 hover:text-blue-500">
                                        <FiEdit3
                                          size={20}
                                          onClick={() =>
                                            handleOpenModal(schedule)
                                          }
                                        />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
      {/*삭제 확인 모달 */}
      <DeleteConfirmModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={handleConfirmDelete}
      />
      {/*일정 수정, 추가 모달*/}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={handleModalClose}
        schedule={selectedSchedule}
        isEdit={isEdit}
      />
      {/*유저 정보 모달*/}
      <UserInfoModal
        isOpen={isUserInfoModalOpen}
        onClose={closeUserInfoModal}
      />
    </div>
  );
}