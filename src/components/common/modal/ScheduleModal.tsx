import apiClient from '../../../utils/apiClient';
import React, { useEffect, useState } from 'react';
import basicProfile from '../../../assets/images/basic_user_profile.png'
import useScheduleStore from '../../../store/useScheduleStore';
import useUserStore from '../../../store/useUserstore';
import TeamMemberSelector from '../TeamMemberSelector';
// 사용자정보 인터페이스( id, name, avatar ), 스케줄 인터페이스 ( id, title, content, projectTitle, status, priority, taskMember, startDate, endDate, team_id )
import { TeamMember, Schedule } from '../../../types/scheduleTypes';
import ProjectSelector from '../ProjectSelector';

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
  const [projectColor, setProjectColor] = useState('#599BFF'); // 프로젝트 색상 추가
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]); // 선택된 팀원 배열
  const [selectedProject, setSelectedProject] = useState<{ title: string; color: string } | null>(null);
  const user = useUserStore((state) => state.user); // 사용자 정보 가져오기
  const teamId = user?.team_id; // team_id 가져오기
  // 일정 상태관리에서 가져오기
  const { addSchedule, updateSchedule } = useScheduleStore();
  const handleProjectSelect = (project: { title: string; color: string }) => {
    setSelectedProject(project); // 선택된 프로젝트 정보를 모달 상태로 설정
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // 날짜가 유효한지 확인
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
  };
  // 모달이 열릴 때 선택된 일정 데이터로 초기화
  useEffect(() => {
    if (schedule) {
      setScheduleName(schedule.title || '');
      setScheduleContent(schedule.content || '');
      setStartDate(formatDate(schedule.startDate) || '');
      setEndDate(formatDate(schedule.endDate) || '');
      setStatus(schedule.status || '할 일');
      setPriority(schedule.priority || '중간');
      setProjectColor("#DFEDF9");
      setSelectedMembers(schedule.taskMember || []); // 수정 모드일 때 선택된 팀원 로드
      setSelectedProject(schedule.project ? { title: schedule.project.title, color: schedule.project.color } : null);
    }
  }, [schedule]);

  /** 상태값 초기화 */
  const clearForm = () => {
    setScheduleName('');
    setProjectName('');
    setScheduleContent('');
    setStartDate('');
    setEndDate('');
    setPriority('중간');
    setStatus('할 일');
    setSelectedMembers([]);
    setProjectColor("#DFEDF9");
    setSelectedProject(null);
  };

  const isFormValid = () => {
    return (
      scheduleName.trim() !== '' &&
      selectedProject !== null && // 프로젝트가 선택되었는지 확인
      selectedProject.title.trim() !== '' && // 프로젝트 타이틀이 있는지 확인
      selectedProject.color.trim() !== '' && // 프로젝트 색상이 있는지 확인
      scheduleContent.trim() !== '' &&
      startDate.trim() !== '' &&
      endDate.trim() !== '' &&
      selectedMembers.length > 0 // 팀원이 선택되었는지 확인
    );
  };
  /** 일정 추가 요청 보내기 */
  const handleAddClick = async () => {
    // 서버로 보내는 일정 데이터
    const newScheduleforServer = {
      title: scheduleName,
      content: scheduleContent,
      projectTitle: selectedProject?.title,
      team_id: teamId, // team_id는 로그인 시 받아와 store에 저장해 둔 값
      startDate,
      endDate,
      status,
      priority,
      projectColor: selectedProject?.color,
      taskMember: selectedMembers.map((member) => member.id),
    };
    console.log(newScheduleforServer)
    if (!isFormValid()) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }

      if (isEdit) {
        // 수정 로직
        const response = await apiClient.put(
          `/api/tasks/${schedule.id}`,
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
        updateSchedule(schedule.id, newScheduleforServer);
      } else {
        // 등록 로직
        const response = await apiClient.post(
          `/api/tasks`,
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
        addSchedule(newScheduleforServer);
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

  /** 모달창(수정모드) 닫기 시 입력 필드 초기화 */
  const handleModalClose = () => {
    onClose();
    clearForm();
  };

  // 팀원 추가 핸들러
  const handleAddMember = (member: TeamMember) => {
    if (!selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers((prevMembers) => [...prevMembers, member]); // 중복되지 않으면 추가
    }
  };

  // 팀원 제거 핸들러
  const handleRemoveMember = (memberId: number) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== memberId),
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
      onClick={handleModalClose} // 배경 클릭 시 모달 닫힘
    >
      <div
        className="relative bg-white w-[600px] h-[90vh] rounded-[10px] shadow-lg p-8 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 중지
      >
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={handleModalClose}
        >
          &times;
        </button>

        {/* 일정 명 */}
        <div className="mb-6 mt-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="일정명을 입력해주세요."
            className="w-[530px] border border-gray-300 rounded-[10px] p-2 text-center focus:outline-none"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
          />
        </div>

        {/* 프로젝트 선택 */}
        <ProjectSelector onSelectProject={setSelectedProject} selectedProject={selectedProject} />

        {selectedProject && (
          <div className="mt-4">
            <p>선택된 프로젝트: {selectedProject.title}</p>
            <p>선택된 색상: <span style={{ color: selectedProject.color }}>{selectedProject.color}</span></p>
          </div>
        )}

        {/* 일정 상세 내용 */}
        <div className="mb-6 mt-6 flex items-center gap-4">
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

          {/* 시작 날짜 */}
          <input
            type="date"
            className="border border-gray-300 rounded-[10px] p-2 mr-3"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}  // 오늘 날짜 이전은 선택 불가
            onChange={(e) => {
              setStartDate(e.target.value);
              if (e.target.value > endDate) {
                setEndDate(e.target.value);  // 시작 날짜가 끝나는 날짜보다 뒤로 가면 끝나는 날짜를 시작 날짜로 맞춤
              }
            }}
          />

          <span> - </span>

          {/* 끝나는 날짜 */}
          <input
            type="date"
            className="border border-gray-300 rounded-[10px] p-2 ml-3"
            value={endDate}
            min={startDate || new Date().toISOString().split('T')[0]}  // 시작 날짜 이후로만 설정 가능
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* 팀원 추가 */}
        <TeamMemberSelector onAddMember={handleAddMember} />

        {/* 선택된 팀원 목록 */}
        <div className="selected-members mt-4">
          <h4>선택된 팀원 목록:</h4>
          <ul className="border rounded p-2">
            {selectedMembers.length === 0 ? (
              <li className="text-gray-500">선택된 팀원이 없습니다.</li>
            ) : (
              selectedMembers.map((member) => (
                <li
                  key={member.id}
                  className="p-1 flex items-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleRemoveMember(member.id)} // 클릭 시 팀원 제거
                >
                  <img
                    src={member.avatar}
                    alt={`${member.name}의 아바타`}
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                    onError={
                      (e) => (e.currentTarget.src = basicProfile) // 이미지 로딩 실패 시 기본 이미지 표시
                    }
                  />
                  {member.name}
                  <span className="ml-auto text-red-500">제거</span>{' '}
                  {/* 제거 표시 */}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end">
          <button
            className="bg-primary text-white mt-4 rounded-[10px] px-4 py-2 hover:bg-[#257ADA] transition-colors ease-linear"
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
