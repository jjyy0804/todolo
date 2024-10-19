import calendarImg from '../../../assets/icons/calendar.png';
import trashImg from '../../../assets/icons/trash.png';
import editImg from '../../../assets/icons/edit.png';
import useUserStore from '../../../store/useUserstore';
import React, { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import basicProfileImage from '../../../assets/images/basic_user_profile.png';
import apiClient from '../../../utils/apiClient';
import CommentSection from './CommentSection';

interface Member {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

// interface Comment {
//   id: number;
//   user: string;
//   avatar?: string; // 추가
//   date: string;
//   content: string;
// }

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

function CalendarModal({
  isOpen,
  onClose,
  taskId, // task 추가
}: CalendarModalProps) {
  const [task, setTask] = useState<Task>();
  // 날짜 너무 길어서 자릿수 제한
  const fixedStartDate = task?.startDate.substring(0, 10);
  const fixedEndDate = task?.endDate.substring(0, 10);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log({ taskId });
    apiClient
      .get(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log({ response });
        const fetchedTask = response.data.data[0]; // 예시로 첫 번째 태스크만 가져온다고 가정
        console.log({ fetchedTask });

        setTask({
          ...fetchedTask,
          projectTitle: fetchedTask.project?.title, // project.title을 projectTitle에 매핑
          taskMembers: fetchedTask.taskMembers.map((member: any) => ({
            ...member,
            avatar: member.avatar !== 'N/A' ? member.avatar : basicProfileImage,
            // 'N/A' -> avatar가 없을 때 나타나는 값
            // 있을 때 -> member.avatar
            // 없을 때 -> basicProfileImage로 대체
          })),
        });
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
  }, []);

  // if (!isOpen || !task) return null; // 모달이 열리지 않거나 task가 없는 경우 렌더링 X

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] max-h-[90vh] p-6 rounded-lg relative overflow-y-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-softgray hover:text-darkgray"
        >
          X
        </button>

        {/* 모달 헤더 */}
        <div className="flex items-center mb-0">
          {/** 달력 아이콘 + 월 */}
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
          <label className="block text-darkgray">프로젝트명</label>
          <input
            type="text"
            value={task?.projectTitle}
            readOnly
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-darkgray"
          />
        </div>

        <div className="mb-4">
          <label className="block text-darkgray">참여한 팀원</label>
          <div className="flex items-center space-x-2 mt-1 p-1 border border-gray-300 rounded-lg bg-white">
            {task?.taskMembers.map((member: Member, index: number) => (
              <div key={index} className="flex items-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-[30px] h-[30px] rounded-full bg-secondary"
                />
              </div>
            ))}
            {/* {task?.taskMembers.length > 3 && (
              <span>+{task?.taskMembers.length - 3}</span>
            )} */}
          </div>
        </div>

        {/* 가로 선 추가 */}
        <hr className="my-4 border-t border-gray-300" />

        {/* 상세 내용 */}
        <div className="mb-4">
          <label className="block text-darkgray">상세 내용</label>
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
      </div>
    </div>
  );
}

export default CalendarModal;
