import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import BasicImage from '../assets/images/basic_user_profile.png'; //프로필 기본이미지
//사용자정보 인터페이스( id, name, avatar ), 스케줄 인터페이스 ( id,title,content,projectTitle,status,priority,taskMember,startDate,endDate,team_id )
import { Schedule } from '../types/scheduleTypes';
import { Comment } from '../types/calendarModalTypes';
import CalendarModal from '../components/common/modal/CalendarModal';

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
  const token = localStorage.getItem('accessToken'); // 토큰 가져오기
  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    // 새로운 사용자가 로그인했을 때, 팀이 없으면 일정 초기화
    if (!isAuthenticated || !user?.team_id) {
      useScheduleStore.getState().clearSchedules(); // 상태 초기화
    } else {
      // 현재 사용자의 팀 일정을 서버에서 가져옴
      fetchSchedulesFromServer(user.team_id, token);
    }
  }, [fetchSchedulesFromServer, user?.team_id, token, isAuthenticated]);
  // 일정 필터링
  useEffect(() => {
    const filtered = schedules.filter((schedule) => {
      const projectMatch = schedule.projectTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const memberMatch = schedule.taskMember?.some((member) =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return projectMatch || memberMatch;
    });

    setFilteredSchedules(filtered);
  }, [schedules, searchTerm]);

  /** 드래그가 끝났을 때 호출되며, 항목이 드롭된 위치에 맞게 schedules 배열을 업데이트 */
  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    // 드롭되지 않은 경우 종료
    if (!destination) return;

    // 이동된 일정 찾기 (source에서 해당 index의 일정 찾기)
    const sourceTasks = filteredSchedules.filter(
      (schedule) => schedule.status === source.droppableId,
    );
    const movedItem = sourceTasks[source.index];

    if (!movedItem) return;

    // 새로운 상태로 변경
    const newStatus = destination.droppableId as '할 일' | '진행 중' | '완료';

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('인증 토큰이 없습니다.');

      // 서버에 상태 업데이트 요청
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/tasks/${movedItem.id}`,
        { ...movedItem, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // 상태가 성공적으로 변경된 경우 스토어와 UI 업데이트
      updateSchedule(movedItem.id, { ...movedItem, status: newStatus });

      alert('상태가 성공적으로 업데이트되었습니다.');

      // UI에 반영 (드래그된 일정의 상태 변경)
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === movedItem.id
          ? { ...schedule, status: newStatus }
          : schedule,
      );

      setFilteredSchedules(updatedSchedules);
      setSchedules(updatedSchedules);
    } catch (error) {
      console.error('상태 업데이트 중 오류:', error);
      alert('상태 업데이트에 실패했습니다. 다시 시도해주세요.');
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
        console.log(`삭제할 일정 ID: ${scheduleToDelete.id}`);

        // 서버에서 삭제 요청
        const isDeleted = await deleteTask(scheduleToDelete.id); //서버에서 일정 삭제

        // 삭제 성공 여부에 따른 처리
        if (isDeleted) {
          removeSchedule(scheduleToDelete.id); // 서버에서 삭제 성공 시 스토어에서 일정 삭제
          alert('일정이 성공적으로 삭제되었습니다.');
        } else {
          alert('일정 삭제에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error: any) {
        console.error('일정 삭제 중 오류 발생:', error);
        alert('일정 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  };
  // avatar가 절대 경로가 아닌 경우 처리
  const avatarUrl = user?.avatar
    ? `http://localhost:3000/uploads/${user.avatar.split('\\').pop()}`
    : `${BasicImage}`; // 기본 이미지

  //-------------------CalendarModal---------------------
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [task, setTask] = useState({
    title: 'title: 일정(업무)의 이름',
    date: '10/5~10/10',
    projectName: '프로젝트명',
    teamMembers: [
      { name: '유저1', avatar: 'path/to/avatar1' },
      { name: '유저2', avatar: 'path/to/avatar2' },
    ],
    details: '이 프로젝트는 어떻게 진행될 예정이고 내용은 이러이러 합니다...',
    comments: [
      {
        id: Date.now(),
        user: '주영님',
        date: '2024. 10. 07.',
        content: '내일까지 프로필 끝내면 될까요??',
      },
    ],
  });

  // CalendarModal 오픈 & 클로즈
  const openModal = () => setIsCalendarModalOpen(true);
  const closeModal = () => setIsCalendarModalOpen(false);

  // 댓글 등록 핸들러
  const handleCommentSubmit = (newComment: Comment) => {
    setTask((prevTask) => ({
      ...prevTask,
      comments: [...prevTask.comments, newComment],
    }));
  };

  // 댓글 수정 핸들러
  const handleCommentEdit = (id: number, updatedContent: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      comments: prevTask.comments.map((comment) =>
        comment.id === id ? { ...comment, content: updatedContent } : comment,
      ),
    }));
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = (id: number) => {
    setTask((prevTask) => ({
      ...prevTask,
      comments: prevTask.comments.filter((comment) => comment.id !== id),
    }));
  };

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col w-screen h-screen bg-white overflow-auto">
        {/* 사용자 정보 (프로필사진, 이름, 소속팀) */}
        <div className="flex items-start space-x-2 mt-12 ml-2 mb-4">
          <img
            src={avatarUrl}
            alt="Profile_Img"
            className="w-[40px] h-[40px] rounded-full cursor-pointer"
            onClick={openUserInfoModal}
            onError={(e) => (e.currentTarget.src = `${BasicImage}`)} // 오류 시 기본 이미지로 대체
          />
          <div>
            <h4 className="text-[17px] font-regular mt-2">
              {user?.name} ({user?.team || '아직 팀이 없습니다.'})
            </h4>
          </div>
        </div>

        {/* 사용자 검색 창 */}
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
                      className="flex flex-col h-full"
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

                      {/* 일정 목록이 스크롤되는 영역 */}
                      <div className="w-[374px] h-[710px] bg-[#DFEDF9] rounded-lg overflow-y-auto p-4 space-y-4">
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
                                  onClick={openModal}
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
                                  <div className="flex space-x-2">
                                    <button
                                      className="text-gray-400 hover:text-red-500"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openDeleteModal(schedule);
                                      }}
                                    >
                                      <FiTrash2 size={20} />
                                    </button>

                                    <button
                                      className="text-gray-400 hover:text-blue-500"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleOpenModal(schedule);
                                      }}
                                    >
                                      <FiEdit3 size={20} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>

                      {/* + ADD 버튼을 컨테이너 밖에 고정 */}
                      <div className="w-full flex justify-center mt-4">
                        <button
                          className="w-[90%] h-[51px] bg-primary text-white font-bold rounded-full hover:bg-[#257ADA] transition-colors ease-linear"
                          onClick={() => {
                            if (!isAuthenticated || !user?.team_id) {
                              alert('로그인 및 팀이 필요합니다.');
                            } else {
                              handleOpenModal(null);
                            }
                          }}
                        >
                          + ADD
                        </button>
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
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() =>
                                          openDeleteModal(schedule)
                                        }
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
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() =>
                                          openDeleteModal(schedule)
                                        }
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
      {/* 캘린더 상세 모달 */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={closeModal}
        task={task}
        onCommentSubmit={handleCommentSubmit}
        onCommentEdit={handleCommentEdit} // 추가된 핸들러
        onCommentDelete={handleCommentDelete} // 추가된 핸들러
      />
    </div>
  );
}
