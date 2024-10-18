import calendarImg from '../../../assets/icons/calendar.png';
import trashImg from '../../../assets/icons/trash.png';
import editImg from '../../../assets/icons/edit.png';
import useUserStore from '../../../store/useUserstore';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import basicProfileImage from '../../assets/images/basic_user_profile.png';


interface TeamMember {
  name: string;
  avatar: string;
}

interface Comment {
  id: number;
  user: string;
  avatar?: string;  // 추가
  date: string;
  content: string;
}

interface Task {
  title: string;
  date: string;
  projectName: string;
  teamMembers: TeamMember[];
  details: string;
  comments: Comment[];
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onCommentSubmit: (newComment: Comment) => void; // 댓글 추가 로직을 부모에서 관리
  onCommentEdit: (id: number, updatedContent: string) => void; // 댓글 수정 로직
  onCommentDelete: (id: number) => void; // 댓글 삭제 로직
}

function CalendarModal({
  isOpen,
  onClose,
  task, // task 추가
  onCommentSubmit,
  onCommentEdit,
  onCommentDelete
}: CalendarModalProps) {

  const { user } = useUserStore(); // Zustand에서 user 정보 가져오기
  const [profileImage, setProfileImage] = useState(
    user?.avatar || `${basicProfileImage}`,
  );
  const [currentTask, setCurrentTask] = useState<Task | null>(null); // Task 상태 관리
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // 현재 수정 중인 댓글 ID
  const [editedContent, setEditedContent] = useState(''); // 수정된 댓글 내용

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/teams/6710a1f2df52cd53f2d9c77f`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        const fetchedTask = response.data.data[0]; // 예시로 첫 번째 태스크만 가져온다고 가정
        const formattedTask = {
          title: fetchedTask.title,
          date: `${fetchedTask.startDate.split('T')[0]} ~ ${fetchedTask.endDate.split('T')[0]}`,
          projectName: fetchedTask.project.title,
          teamMembers: fetchedTask.taskMembers.map((member: any) => ({
            name: member.name,
            avatar: member.avatar || basicProfileImage,
          })),
          details: fetchedTask.content,
          comments: fetchedTask.comments || [],
        };
        setCurrentTask(formattedTask);
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
  }, []);

  if (!isOpen || !task) return null; // 모달이 열리지 않거나 task가 없는 경우 렌더링 X

 

  // -----------------<댓글: Comment>-----------------
  // 댓글 등록
  const handleCommentSubmit = () => {
    if (newComment.trim() === '') return; // 댓글 비었을 때 등록 X

    const comment: Comment = {
      id: Date.now(),
      user: user?.name || 'Unknown User',
      date: new Date().toLocaleDateString(),
      content: newComment,
    };

    setCurrentTask((prevTask) => prevTask && ({
      ...prevTask,
      comments: [...prevTask.comments, comment],
    }));
    setNewComment(''); // 댓글 입력 필드 초기화
  };

  // 댓글 수정
  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleEditSave = (id: number) => {
    if (editedContent.trim() === '') return;
    setCurrentTask((prevTask) => prevTask && ({
      ...prevTask,
      comments: prevTask.comments.map((comment) =>
        comment.id === id ? { ...comment, content: editedContent } : comment
      ),
    }));
    setEditingCommentId(null);
    setEditedContent('');
  };

  // 댓글 삭제
  const handleDeleteClick = (id: number) => {
    const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
    if (isConfirmed) {
      setCurrentTask((prevTask) => prevTask && ({
        ...prevTask,
        comments: prevTask.comments.filter((comment) => comment.id !== id),
      }));
    }
  };

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
              {task.title}
            </h2>
            <p className="text-softgray">{task.date}</p>
          </div>
        </div>

        {/* 프로젝트명, 팀 정보 */}
        <div className="mb-4">
          <label className="block text-darkgray">프로젝트명</label>
          <input
            type="text"
            value={task.projectName}
            readOnly
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-darkgray"
          />
        </div>

        <div className="mb-4">
          <label className="block text-darkgray">참여한 팀원</label>
          <div className="flex items-center space-x-2 mt-1 p-1 border border-gray-300 rounded-lg bg-white">
            {task.teamMembers.map((member, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-[30px] h-[30px] rounded-full bg-secondary"
                />
              </div>
            ))}
            {task.teamMembers.length > 3 && (
              <span>+{task.teamMembers.length - 3}</span>
            )}
          </div>
        </div>

        {/* 가로 선 추가 */}
        <hr className="my-4 border-t border-gray-300" />

        {/* 상세 내용 */}
        <div className="mb-4">
          <label className="block text-darkgray">상세 내용</label>
          <textarea
            value={task.details}
            readOnly
            className="w-full h-[200px] p-2 mt-1 border border-gray-300 rounded-lg text-darkgray"
          />
        </div>

        {/* 가로 선 추가 */}
        <hr className="my-4 border-t border-gray-300" />

        {/* 댓글 섹션 */}
        <div>
          <h3 className="text-darkgray mb-2">댓글</h3>
          <div className="space-y-3">
            {task.comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                {/** 댓글 프로필 사진 (프로필 이미지 댕겨와야 함) */}
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

                {/** 이름, 댓글등록날짜, 내용 */}
                <div className="flex-grow">
                  {editingCommentId === comment.id ? (
                    // 댓글 수정 모드
                    <div className="flex flex-row w-full">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg h-[40px] mr-1"
                        style={{ flexBasis: '90%' }}
                      />
                      <button
                        onClick={() => handleEditSave(comment.id)}
                        className="bg-primary text-white text-[12px] font-bold rounded-lg h-[25px] mt-2"
                        style={{ flexBasis: '10%' }}
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    // 댓글 보기 모드
                    <div>
                      <p className="text-darkgray text-sm">
                        {comment.user}{' '}
                        <span className="text-softgray">({comment.date})</span>
                      </p>
                      <p className="text-darkgray">{comment.content}</p>
                    </div>
                  )}
                </div>

                {/* 수정 및 삭제 버튼 */}
                <div className="flex flex-row justify-end mt-3">
                  <img
                    src={editImg}
                    alt="edit"
                    onClick={() => handleEditClick(comment)}
                    className="mt-[2.2px] mr-2 w-[22px] h-[22px] cursor-pointer"
                  ></img>
                  <img
                    src={trashImg}
                    alt="remove"
                    onClick={() => handleDeleteClick(comment.id)}
                    className="mr-2 w-[20px] h-[22.5px] cursor-pointer"
                  ></img>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 댓글 입력 */}
        <div className="flex flex-row mt-4 w-full">
          <textarea
            placeholder="댓글을 입력하세요."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg mr-2 h-[40px]"
            style={{ flexBasis: '90%' }}
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-primary text-white font-bold text-[13px] p-1 rounded-lg h-[40px]"
            style={{ flexBasis: '10%' }}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
