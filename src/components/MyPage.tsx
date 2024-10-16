import React, { useState } from 'react';
import NavigationBar from './common/NavigationBar';
import basicProfileImage from '../assets/images/basic_user_profile.png';
import teamImg from '../assets/icons/team.png';
import todoImg from '../assets/icons/todo.png';
import inProgressImg from '../assets/icons/inProgress.png';
import completedImg from '../assets/icons/completed.png';
import CalendarModal from '../components/common/modal/CalendarModal';

// 댓글 인터페이스 정의
interface Comment {
  id: number;
  user: string;
  date: string;
  content: string;
}

export default function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    <div className="flex justify-center items-center h-screen p-10">
      <NavigationBar />

      {/* 왼쪽 섹션 (프로필 및 프로젝트 셀렉트박스) */}
      <div className="flex flex-col w-3/5 space-y-4 mt-16 ml-20">
        {/* 프로필 섹션 */}
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
        </div>
      </div>

      {/* 캘린더 상세 모달 */}
      <CalendarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={task}
        onCommentSubmit={handleCommentSubmit}
        onCommentEdit={handleCommentEdit} // 추가된 핸들러
        onCommentDelete={handleCommentDelete} // 추가된 핸들러
      />
    </div>
  );
}
