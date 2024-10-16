import axios from 'axios';
import React, { useEffect, useState } from 'react';
import magnifyingglass from '../../../assets/icons/magnifyingglass.png';
import useScheduleStore from '../../../store/useScheduleStore';
import useUserStore from '../../../store/useUserstore';
import TeamMemberSelector from '../TeamMemberSelector';
//사용자정보 인터페이스( id, name, avatar ), 스케줄 인터페이스 ( id,title,content,projectTitle,status,priority,taskMember,startDate,endDate,team_id )
import { TeamMember, Schedule } from '../../../types/scheduleTypes';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: any | null;
  isEdit: boolean; // 수정 모드 여부
}
const ScheduleModal = ({ isOpen, onClose, schedule, isEdit }: ModalProps) => {
  const [scheduleName, setScheduleName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [scheduleContent, setScheduleContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'할 일' | '진행 중' | '완료'>('할 일');
  const [priority, setPriority] = useState<'높음' | '중간' | '낮음'>('중간');
  const [taskMembers, setTaskMembers] = useState<TeamMember[]>([]);
  //유저 상태관리에서 가져오기
  const user = useUserStore((state) => state.user); // 사용자 정보 가져오기
  const teamId = user?.team_id; // team_id 가져오기
  //일정 상태관리에서 가져오기
  const { addSchedule, updateSchedule } = useScheduleStore();
  // 모달이 열릴 때 선택된 일정 데이터로 초기화
  useEffect(() => {
    if (schedule) {
      setScheduleName(schedule.title || '');
      setProjectName(schedule.projectTitle || '');
      setScheduleContent(schedule.content || '');
      setStartDate(schedule.startDate || '');
      setEndDate(schedule.endDate || '');
      setStatus(schedule.status || '할 일');
      setPriority(schedule.priority || '중간');
      setTaskMembers(schedule.taskMember || []);
    }
  }, [schedule]);
  /**상태값 초기화 */
  const clearForm = () => {
    setScheduleName('');
    setProjectName('');
    setScheduleContent('');
    setStartDate('');
    setEndDate('');
    setPriority('중간');
    setStatus('할 일');
    setTaskMembers([]);
  };
  /**일정 추가 요청 보내기*/
  const handleAddClick = async () => {
    //서버로 보내는 일정 데이터
    const newScheduleforServer = {
      title: scheduleName,
      content: scheduleContent,
      projectTitle: projectName,
      team_id: teamId, // team_id는 로그인 시 받아와 store에 저장해 둔 값
      startDate,
      endDate,
      status,
      priority,
      taskMember: taskMembers.map((member) => member.id),
    };
    //일정 스토어에 저장하는 데이터
    const newScheduleForStore: Schedule = {
      id: Date.now(),
      title: scheduleName,
      content: scheduleContent,
      projectTitle: projectName,
      status,
      priority,
      taskMember: taskMembers,
      startDate,
      endDate,
      team_id: teamId,
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      if (isEdit) {
        //수정 로직
        const response = await axios.put(
          `http://localhost:3000/tasks/${schedule.id}`,
          newScheduleforServer,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
              'Content-Type': 'application/json',
            },
          },
        );
        alert('일정이 성공적으로 수정되었습니다.');
        console.log('응답 데이터:', response.data);
        // 상태 업데이트
        updateSchedule(schedule.id, newScheduleForStore);
      } else {
        // 등록 로직
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/tasks`,
          newScheduleforServer,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
              'Content-Type': 'application/json',
            },
          },
        );
        alert('일정이 성공적으로 추가되었습니다.');
        console.log('응답 데이터:', response.data);

        // 상태 업데이트
        addSchedule(newScheduleForStore);
      }
    } catch (error) {
      console.error('일정 추가/수정 중 오류 발생:', error);
      alert('일정 추가/수정에 실패했습니다. 다시 시도해주세요.');
      console.log(newScheduleforServer);
    } finally {
      onClose();
      clearForm();
    }
  };
  /**모달창(수정모드) 닫기 시 입력 필드 초기화 */
  const handleModalClose = () => {
    onClose();
    clearForm();
  };
  /*팀원 추가 핸들러*/
  const handleAddMember = (member: any) => {
    setTaskMembers((prev) => [...prev, member]);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
      <div className="relative bg-white w-[600px] rounded-[10px] shadow-lg p-8">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={handleModalClose}
        >
          &times;
        </button>

        {/* 일정 명 */}
        <div className="mb-6 mt-6 flex items-center gap-4">
          <label className="w-[80px] text-[16px] font-medium text-darkgray mb-1">
            일정
          </label>
          <input
            type="text"
            placeholder="일정명을 입력해주세요."
            className="w-[530px] border border-gray-300 rounded-[10px] p-2 text-center focus:outline-none"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
          />
        </div>
        {/* 프로젝트 명 */}
        <div className="flex mb-6 items-center justify-end gap-2">
          <select
            className="w-[140px] border border-gray-300 rounded-[10px] p-2 focus:outline-none"
            onChange={(e) => setProjectName(e.target.value)}
          >
            <option value="">프로젝트 선택</option>
            <option value="프로젝트 A">프로젝트 A</option>
            <option value="프로젝트 B">프로젝트 B</option>
            <option value="프로젝트 C">프로젝트 C</option>
          </select>
          <input
            type="text"
            placeholder="프로젝트를 추가하세요."
            className="w-[400px] border border-gray-300 rounded-[10px] p-2 text-center focus:outline-none"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        {/* 일정 상세 내용 */}
        <div className="mb-6 mt-6 flex items-center gap-4">
          <label className="w-[80px] text-[16px] font-medium text-darkgray">
            상세 내용
          </label>
          <textarea
            placeholder="일정의 상세 내용을 입력해주세요."
            className="w-[530px] border border-gray-300 rounded-[10px] p-[60px] h-[150px] focus:outline-none text-center"
            value={scheduleContent}
            onChange={(e) => setScheduleContent(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          {/* 일정 상태 선택 */}
          <div className="mb-6 flex">
            <label className="w-[80px] text-darkgray font-medium mb-2 flex items-center">
              일정 상태
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as '할 일' | '진행 중' | '완료')
              }
              className="p-2 border border-gray-300 rounded-[10px] focus:outline-none"
            >
              <option value="할 일">할 일</option>
              <option value="진행 중">진행 중</option>
              <option value="완료">완료</option>
            </select>
          </div>
          {/* 우선순위 선택 */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <label className="flex items-center text-darkgray font-medium mb-2">
              우선순위
            </label>
            <label
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setPriority('높음')}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-[10px] border-2 border-[#7F56D9]`}
              >
                {priority === '높음' && (
                  <span className="text-[#7F56D9] text-lg font-semibold">
                    ✔
                  </span>
                )}
              </div>
              <span className="text-darkgray">높음</span>
            </label>

            <label
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setPriority('중간')}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-[10px] border-2 border-[#FFC14A]`}
              >
                {priority === '중간' && (
                  <span className="text-[#FFC14A] text-lg font-semibold">
                    ✔
                  </span>
                )}
              </div>
              <span className="text-darkgray">중간</span>
            </label>

            <label
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setPriority('낮음')}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-[10px] border-2 border-[#938f99]`}
              >
                {priority === '낮음' && (
                  <span className="text-[#938f99] text-lg font-semibold">
                    ✔
                  </span>
                )}
              </div>
              <span className="text-darkgray">낮음</span>
            </label>
          </div>
        </div>
        {/* 일정 날짜 */}
        <div className="flex items-center mb-6">
          <label className="w-[80px] text-[16px] font-medium text-darkgray">
            진행 기간
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded-[10px] p-2 mr-3"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span> - </span>
          <input
            type="date"
            className="border border-gray-300 rounded-[10px] p-2 ml-3"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* 팀원 추가 */}
        <TeamMemberSelector onAddMember={handleAddMember} />

        {/* 하단 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-primary text-white rounded-[10px] px-4 py-2 hover:bg-[#257ADA] transition-colors ease-linear"
            onClick={handleAddClick}
          >
            {isEdit ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
