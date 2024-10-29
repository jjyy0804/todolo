import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import NavigationBar from './common/NavigationBar';
import todoImg from '../assets/icons/todo.png';
import inProgressImg from '../assets/icons/inProgress.png';
import completedImg from '../assets/icons/completed.png';
import glassImg from '../assets/icons/magnifyingglass.png';
import ScheduleModal from './common/modal/ScheduleModal';
import useUserStore from '../store/useUserstore';
import useScheduleStore from '../store/useScheduleStore';
import DeleteConfirmModal from './common/modal/DeleteConFirmModal';
import UserInfoModal from './UserInfoModal';
import useDeleteTask from '../hooks/task/useDeleteTask';
import { Schedule } from '../types/scheduleTypes';
import CalendarModal from '../components/common/modal/CalendarModal';
import MyProfile from './common/MyProfile';
import { showErrorToast, showSuccessToast } from '../utils/toast';
// @ts-ignore
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import useUpdateTask from '../hooks/task/useUpdateTask';
export default function Board() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); //등록, 수정 모달 상태
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 (프로젝트명, 사용자명)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  ); //수정할 일정
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 여부
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //삭제 모달 상태
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null,
  ); //삭제할 일정
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false); //유저 정보 모달 상태
  const { user, isAuthenticated } = useUserStore();
  const {
    schedules,
    removeSchedule,
    updateSchedule,
    setSchedules,
    fetchSchedulesFromServer,
  } = useScheduleStore();
  const [filteredSchedules, setFilteredSchedules] =
    useState<Schedule[]>(schedules); //사용자 및 프로젝트 검색
  const openUserInfoModal = () => setIsUserInfoModalOpen(true);
  const closeUserInfoModal = () => setIsUserInfoModalOpen(false);
  const { deleteTask } = useDeleteTask(); //일정 삭제 커스텀 훅
  const { updateTask } = useUpdateTask(); //일정 수정 커스텀 훅
  const token = localStorage.getItem('accessToken'); // 토큰 가져오기

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      if (!user?.team_id) {
        // useScheduleStore.getState().clearSchedules(); // 팀이 없으면 상태 초기화 (새로고침 시 일정 초기화 에러때문 주석처리)
        return;
      }

      try {
        // 서버에서 일정 데이터를 가져옴
        await fetchSchedulesFromServer(user.team_id, token);
      } catch (error) {
        console.error('일정 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [fetchSchedulesFromServer, user?.team_id, token]);

  // 일정 필터링
  useEffect(() => {
    const filtered = schedules.filter((schedule) => {
      const projectMatch = schedule.projectTitle
        ? schedule.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
        : false; // projectTitle이 없는 경우 false 반환

      const memberMatch = schedule.taskMember
        ? schedule.taskMember.some((member) =>
          member?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        : false; // taskMember가 없는 경우 false 반환

      return projectMatch || memberMatch;
    });

    setFilteredSchedules(filtered);
  }, [schedules, searchTerm]);

  /** 드래그가 끝났을 때 호출되며, 항목이 드롭된 위치에 맞게 schedules 배열을 업데이트 */
  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    // 드롭되지 않은 경우 종료
    if (!destination) return;

    // 같은 상태끼리 움직이면 종료
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // 이동된 일정 찾기 (source에서 해당 index의 일정 찾기)
    const sourceTasks = filteredSchedules.filter(
      (schedule) => schedule.status === source.droppableId,
    );
    const movedItem = sourceTasks[source.index];

    if (!movedItem) return;

    // 새로운 상태로 변경
    const newStatus = destination.droppableId as '할 일' | '진행 중' | '완료';

    // 같은 상태로 이동 시 상태 업데이트 로직 실행 안함
    if (movedItem.status === newStatus) {
      return;
    }

    try {
      // 서버에서 업데이트 요청
      await updateTask(movedItem.id, { ...movedItem, status: newStatus })
      // 서버 요청 성공 후 UI 업데이트
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === movedItem.id && schedule.status !== newStatus
          ? { ...schedule, status: newStatus }
          : schedule,
      );
      setFilteredSchedules(updatedSchedules);
      setSchedules(updatedSchedules);
      // 상태가 성공적으로 변경된 경우 스토어 업데이트
      updateSchedule(movedItem.id, { ...movedItem, status: newStatus });
    } catch (error) {
      console.error('상태 업데이트 중 오류:', error);
      showErrorToast('상태 변경 권한이 없습니다.');
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
  const handleConfirmDelete = async () => {
    if (scheduleToDelete) {
      try {
        // 서버에서 삭제 요청
        const isDeleted = await deleteTask(scheduleToDelete.id); //서버에서 일정 삭제

        // 삭제 성공 여부에 따른 처리
        if (isDeleted) {
          removeSchedule(scheduleToDelete.id); // 서버에서 삭제 성공 시 스토어에서 일정 삭제
          showSuccessToast('일정이 성공적으로 삭제되었습니다.');
        } else {
          showErrorToast('일정 삭제에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('일정 삭제 중 오류 발생:', error);
        showErrorToast('삭제 권한이 없습니다.');
      }
    }
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  };

  //-------------------CalendarModal---------------------
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // CalendarModal 모달 열기 함수
  const openModal = (schedule: any) => {
    setSelectedSchedule(schedule); // 선택된 일정을 상태에 저장
    setIsCalendarModalOpen(true); // 모달 열림 상태로 설정
  };

  // CalendarModal모달 닫기 함수
  const closeModal = () => {
    setIsCalendarModalOpen(false); // 모달 닫음
    setSelectedSchedule(null); // 선택된 일정 초기화
  };
  //-----------------------------------------------------
  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col w-screen h-screen overflow-auto bg-white">
        {/* 사용자 정보 (프로필사진, 이름, 소속팀) */}
        <MyProfile openUserInfoModal={openUserInfoModal} />
        {/* 사용자 검색 창 */}
        <div className="flex flex-row items-end justify-end mb-4 space-x-4 mr-36">
          <div className="relative w-[343px]">
            {' '}
            {/* 인풋 박스를 감싸는 relative 컨테이너 */}
            <input
              type="text"
              placeholder="프로젝트 및 사용자 이름 검색"
              className="w-[343px] h-[32px] border-none rounded-[10px] p-2 pl-8 bg-slate-50 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src={glassImg}
              alt="Search Icon"
              className="absolute transform -translate-y-1/2 left-3 top-1/2"
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
                  {(provided: any) => (
                    <div
                      className="flex flex-col h-full"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {/* Todo 제목과 + 버튼이 함께 배치되는 영역 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <img
                            src={todoImg}
                            alt="Todo Icon"
                            className="w-[25px] h-[25px] mr-1"
                          />
                          <h3 className="text-[17px] font-regular">Todo</h3>
                        </div>

                        {/* 일정 등록 버튼 */}
                        <button
                          className="bg-primary text-white font-bold rounded-full w-[25px] h-[25px] flex items-center justify-center hover:bg-hoverprimary transition-colors ease-linear"
                          onClick={() => {
                            if (!isAuthenticated || !user?.team_id) {
                              showErrorToast('로그인 및 팀이 필요합니다.');
                            } else {
                              handleOpenModal(null);
                            }
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* 일정 목록이 스크롤되는 영역 */}
                      <div className="w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg overflow-y-auto p-4 space-y-4">
                        {filteredSchedules
                          .filter((schedule) => schedule.status === '할 일')
                          .map((schedule, index) => (
                            <Draggable
                              key={schedule.id}
                              draggableId={
                                schedule.id
                                  ? schedule.id.toString()
                                  : 'default-id'
                              }
                              index={index}
                            >
                              {(provided: any) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex justify-between p-2 bg-white rounded-md shadow-md text-darkgray"
                                  onClick={() => openModal(schedule)} // 클릭 시 모달을 여는 함수 호출
                                >
                                  <div>
                                    <h4 className="font-bold">
                                      {schedule.title}
                                    </h4>
                                    <p className="text-sm">
                                      {schedule.projectTitle}
                                    </p>
                                    <p className="text-sm">
                                      우선순위 {schedule.priority}
                                    </p>
                                  </div>
                                  <div className="flex space-x-4">
                                    {/* 수정 버튼 */}
                                    <button
                                      className="text-gray-400 hover:text-blue-500"
                                      onClick={(event) => {
                                        event.stopPropagation(); // 드래그 및 클릭 이벤트 방지
                                        handleOpenModal(schedule); // 수정 모달 열기
                                      }}
                                    >
                                      <FiEdit3 size={20} />
                                    </button>
                                    {/* 삭제 버튼 */}
                                    <button
                                      className="text-gray-400 hover:text-red-500"
                                      onClick={(event) => {
                                        event.stopPropagation(); // 드래그 및 클릭 이벤트 방지
                                        openDeleteModal(schedule); // 삭제 모달 열기
                                      }}
                                    >
                                      <FiTrash2 size={20} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>

                {/* In Progress 보드 */}
                <Droppable droppableId="진행 중">
                  {(provided: any) => (
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

                      {/* 상태 = "진행 중" 일정 카드 */}
                      <div className="overflow-y-auto w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg">
                        <div className="flex flex-col p-4 space-y-4">
                          {filteredSchedules
                            .filter((schedule) => schedule.status === '진행 중')
                            .map((schedule, index) => (
                              <Draggable
                                key={schedule.id}
                                draggableId={
                                  schedule.id
                                    ? schedule.id.toString()
                                    : 'default-id'
                                }
                                index={index}
                              >
                                {(provided: any) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex justify-between p-2 bg-white rounded-md shadow-md text-darkgray"
                                    onClick={() => openModal(schedule)}
                                  >
                                    <div>
                                      <h4 className="font-bold">
                                        {schedule.title}
                                      </h4>
                                      <p className="text-sm">
                                        {schedule.projectTitle}
                                      </p>
                                      <p className="text-sm">
                                        우선순위 {schedule.priority}
                                      </p>
                                    </div>
                                    <div className="flex space-x-4">
                                      {/* 수정 버튼 */}
                                      <button
                                        className="text-gray-400 hover:text-blue-500"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleOpenModal(schedule); // 수정 모달 열기
                                        }}
                                      >
                                        <FiEdit3 size={20} />
                                      </button>
                                      {/* 삭제 버튼 */}
                                      <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openDeleteModal(schedule); // 삭제 모달 열기
                                        }}
                                      >
                                        <FiTrash2 size={20} />
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

                {/* Completed 보드 */}
                <Droppable droppableId="완료">
                  {(provided: any) => (
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

                      {/* 상태 = "완료" 일정 카드 */}
                      <div className="overflow-y-auto w-[374px] h-[780px] bg-[#DFEDF9] rounded-lg">
                        <div className="flex flex-col p-4 space-y-4">
                          {filteredSchedules
                            .filter((schedule) => schedule.status === '완료')
                            .map((schedule, index) => (
                              <Draggable
                                key={schedule.id}
                                draggableId={
                                  schedule.id
                                    ? schedule.id.toString()
                                    : 'default-id'
                                }
                                index={index}
                              >
                                {(provided: any) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex justify-between p-2 bg-white rounded-md shadow-md text-darkgray"
                                    onClick={() => openModal(schedule)}
                                  >
                                    <div>
                                      <h4 className="font-bold">
                                        {schedule.title}
                                      </h4>
                                      <p className="text-sm">
                                        {schedule.projectTitle}
                                      </p>
                                      <p className="text-sm">
                                        우선순위 {schedule.priority}
                                      </p>
                                    </div>
                                    <div className="flex space-x-4">
                                      {/* 수정 버튼 */}
                                      <button
                                        className="text-gray-400 hover:text-blue-500"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleOpenModal(schedule); // 수정 모달 열기
                                        }}
                                      >
                                        <FiEdit3 size={20} />
                                      </button>
                                      {/* 삭제 버튼 */}
                                      <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openDeleteModal(schedule); // 삭제 모달 열기
                                        }}
                                      >
                                        <FiTrash2 size={20} />
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
      {/* 캘린더 상세 모달 */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={closeModal}
        taskId={selectedSchedule?.id?.toString() || ''}
      />
    </div>
  );
}
