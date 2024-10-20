import React, { useEffect, useState } from 'react';
import apiClient from '../../../utils/apiClient';
import basicProfileImage from '../../../assets/images/basic_user_profile.png';
import CommentSection from './CommentSection';
import calendarImg from '../../../assets/icons/calendar.png';
import Loading from '../../Loading';
import useUserStore from '../../../store/useUserstore';

interface Member {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Task {
  title: string;
  startDate: string;
  endDate: string;
  projectTitle: string;
  taskMembers: Member[];
  comments: Comment[];
  content: string;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

function CalendarModal({ isOpen, onClose, taskId }: CalendarModalProps) {
  const [task, setTask] = useState<Task | null>(null); // 초기 상태 null로 변경
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 관리
  const { user } = useUserStore();
  // 날짜 형식 제한
  const fixedStartDate = task?.startDate?.substring(0, 10);
  const fixedEndDate = task?.endDate?.substring(0, 10);

  useEffect(() => {
    if (taskId) {
      // 모달이 열릴 때 task 초기화
      setTask(null);
      setIsLoading(true); // 로딩 상태 시작

      const accessToken = localStorage.getItem('accessToken');
      apiClient
        .get(`api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const fetchedTask = response.data.data[0];
          setTask({
            ...fetchedTask,
            projectTitle: fetchedTask.project?.title,
            taskMembers: fetchedTask.taskMembers.map((member: any) => ({
              ...member,
              avatar:
                member.avatar !== 'N/A' ? member.avatar : avatarUrl,
            })),
          });
          setIsLoading(false); // 로딩 상태 종료
        })
        .catch((error) => {
          console.error('Error fetching task:', error);
          setIsLoading(false); // 로딩 상태 종료
        });
    }
  }, [taskId]);

  // 상대 경로를 절대 경로로 변환
  const avatarUrl =
    user?.avatar && user.avatar.includes('uploads/')
      ? `/uploads/${user.avatar.split('uploads/')[1]}`
      : basicProfileImage; // 기본 이미지 사용

  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] max-h-[90vh] p-6 rounded-lg relative overflow-y-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-softgray hover:text-darkgray"
        >
          &times;
        </button>

        {/* 로딩 상태일 때 로딩 메시지 표시 */}
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* 모달 헤더 */}
            <div className="flex items-center mb-0">
              <div className="relative">
                <img
                  src={calendarImg}
                  alt="Calendar Icon"
                  className="w-[84px] h-[85px] mr-1 mb-2"
                />
                <span className="absolute top-8 left-6 text-[30px] font-bold text-primary">
                  31
                </span>
              </div>

              <div>
                <h2 className="text-[24px] font-bold text-darkgray">
                  {task?.title}
                </h2>
                <p className="text-softgray">
                  {fixedStartDate}~{fixedEndDate}
                </p>
              </div>
            </div>

            {/* 프로젝트명, 팀 정보 */}
            <div className="mb-4">
              <label className="block text-darkgray font-medium">프로젝트명</label>
              <input
                type="text"
                value={task?.projectTitle}
                readOnly
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-darkgray"
              />
            </div>

            <div className="mb-4">
              <label className="block text-darkgray font-medium">참여한 팀원</label>
              <div className="flex items-center space-x-2 mt-1 p-1 border border-gray-300 rounded-lg bg-white">
                {task?.taskMembers.map((member: Member, index: number) => {
                  // avatar 경로를 절대 경로로 변환
                  const avatarUrl =
                    member.avatar && member.avatar.includes('uploads/')
                      ? `${window.location.origin}/uploads/${member.avatar.split('uploads/')[1]}`
                      : basicProfileImage; // 기본 이미지 사용

                  return (
                    <div key={index} className="flex items-center">
                      <img
                        src={avatarUrl} // 절대 경로로 변환된 avatarUrl 사용
                        alt={member.name}
                        className="w-[30px] h-[30px] rounded-full bg-secondary"
                        onError={(e) => (e.currentTarget.src = basicProfileImage)} // 이미지 로딩 실패 시 기본 이미지 표시
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 가로 선 추가 */}
            <hr className="my-4 border-t border-gray-300" />

            {/* 상세 내용 */}
            <div className="mb-4">
              <label className="font-medium block text-darkgray">상세 내용</label>
              <textarea
                value={task?.content}
                readOnly
                className="w-full h-[200px] p-2 mt-1 border border-gray-300 rounded-lg text-darkgray"
              />
            </div>

            {/* 가로 선 추가 */}
            <hr className="my-4 border-t border-gray-300" />

            {/* 댓글 섹션 */}
            <CommentSection taskId={taskId} />
          </>
        )}
      </div>
    </div>
  );
}

export default CalendarModal;
