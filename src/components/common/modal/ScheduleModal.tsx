import axios from 'axios';
import React, { useState } from 'react';
import magnifyingglass from '../../../assets/icons/magnifyingglass.png';
import useScheduleStore from '../../../store/useScheduleStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ isOpen, onClose }: ModalProps) => {
  const [scheduleName, setScheduleName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [scheduleContent, setScheduleContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'할 일' | '진행 중' | '완료'>('할 일');
  const [priority, setPriority] = useState<'높음' | '중간' | '낮음'>('중간');
  const [teamMembers, setTeamMembers] = useState<string[]>(['주영']);
  //일정 상태관리에서 가져오기
  const { addSchedule } = useScheduleStore();
  /**일정 추가하기
   * 서버로 새로운 일정 등록 요청 후 input 초기화 , 모달 창 닫음
   */
  const handleAddClick = async () => {
    const newSchedule = {
      id: Date.now(), // 임시로 현재 시간을 ID로 사용
      scheduleName,
      projectName,
      scheduleContent,
      startDate,
      endDate,
      status,
      priority,
      teamMembers: teamMembers.map((name, index) => ({ id: index, name })),
    };
    try {
      addSchedule(newSchedule);
      await axios.post('/api/schedules', newSchedule);
      alert('일정이 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('일정 추가 중 오류 발생:', error);
      alert('일정 추가에 실패했습니다. 다시 시도해주세요.');
      console.log(newSchedule);
    } finally {
      onClose;
    }
    // 폼 초기화
    setScheduleName('');
    setProjectName('');
    setScheduleContent('');
    setStartDate('');
    setEndDate('');
    setStatus('할 일');
    setPriority('중간');
    setTeamMembers([]);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
      <div className="relative bg-white w-[600px] rounded-[10px] shadow-lg p-8">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}>
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
            onChange={(e) => setProjectName(e.target.value)}>
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
              className="p-2 border border-gray-300 rounded-[10px] focus:outline-none">
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
              onClick={() => setPriority('높음')}>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-[10px] border-2 border-[#7F56D9]`}>
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
              onClick={() => setPriority('중간')}>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-[10px] border-2 border-[#FFC14A]`}>
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
              onClick={() => setPriority('낮음')}>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-[10px] border-2 border-[#938f99]`}>
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
        <div className="relative mb-6 flex items-center gap-4">
          <label className="w-[80px] text-[16px] font-medium text-darkgray mb-1">
            팀원
          </label>
          <input
            type="text"
            placeholder="팀원을 추가하세요."
            className="w-[530px] border border-gray-300 rounded-[10px] p-2 focus:outline-none"
          />
          <img
            src={magnifyingglass}
            alt="Search Icon"
            className="absolute left-10 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        </div>
        {/* 팀원 목록 이미지 표시 아직 작업 x */}
        <div className="flex space-x-2">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-green-200 rounded-full p-2">
              {member}
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end space-x-4">
          <button className="border border-[#ac2949] text-[#ac2949] rounded-[10px] px-4 py-2 hover:bg-[#ffe3e8] border-transparent transition-colors ease-linear">
            삭제
          </button>
          <button
            className="bg-primary text-white rounded-[10px] px-4 py-2 hover:bg-[#257ADA] transition-colors ease-linear"
            onClick={handleAddClick}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
