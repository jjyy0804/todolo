import React, { useState, useEffect } from 'react';
import editImg from '../../../assets/icons/edit.png';
import trashImg from '../../../assets/icons/trash.png';
import useUserStore from '../../../store/useUserstore'; // Zustand 스토어 임포트
import apiClient from '../../../utils/apiClient';
import basicProfileImage from '../../../assets/images/basic_user_profile.png';


interface Comments {
  // 유저이름, 유저아바타, 현재시간, 댓글내용
  _id: string;
  name: string;
  avatar?: string;
  date: string;
  content: string;
  commentContent: string;
}

interface Props {
  taskId: string;
}
function CommentSection({ taskId }: Props) {
  const [task, setTask] = useState<any>(null); // task의 정확한 타입이 정의되지 않았으므로 any로 둡니다.
  const [comments, setComments] = useState<Comments[]>([]); // 댓글 상태 타입 정의
  const [newComment, setNewComment] = useState<string>(''); // 문자열로 타입 명시
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const { user } = useUserStore(); // Zustand에서 user 정보 가져오기
  const currentDate = new Date().toLocaleDateString();

  // 업무조회에서 댓글
  //apiClient.get(`/tasks/${taskId}` -> 여기에서 "comments": [{}]
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log({ taskId });

    apiClient
      .get(`api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log({ response });
        const fetchedTask = response.data.data[0]; // 예시로 첫 번째 태스크만 가져온다고 가정
        console.log({ fetchedTask });

        // 개발자도구에서 댓글 데이터 구조 확인하기
        console.log('Comments:', fetchedTask.comments);

        setTask(fetchedTask);
        setComments(fetchedTask.comments || []); // 댓글을 상태로 설정
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
  }, [taskId]);

  //---------------------------------------------
  // 댓글 추가
  const handleCommentSubmit = () => {
    if (newComment.trim() === '') return; // 댓글이 비어있을 때, 등록 X

    const accessToken = localStorage.getItem('accessToken');

    apiClient
      .post(
        `api/tasks/${taskId}/comments`,
        { commentContent: newComment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then(() => {
        // 댓글 추가 후 댓글 목록을 새로 고침
        fetchComments(); // 댓글을 가져오는 함수를 호출
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  // 댓글을 가져오는 함수
  const fetchComments = () => {
    const accessToken = localStorage.getItem('accessToken');

    apiClient
      .get(`api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const fetchedTask = response.data.data[0]; // 예시로 첫 번째 태스크만 가져온다고 가정
        setComments(fetchedTask.comments || []); // 댓글을 상태로 설정
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
  };

  // useEffect에서 fetchComments 호출
  useEffect(() => {
    fetchComments(); // 컴포넌트가 마운트될 때 댓글 목록을 가져옴
  }, [taskId]);

  //-----------------------------------
  // 댓글 수정
  //apiClient.put(`/tasks/${taskId}/comments/${commentId}`
  const handleEditSave = (commentId: string) => {
    if (editedContent.trim() === '') return;
    const accessToken = localStorage.getItem('accessToken');

    apiClient
      .put(
        `api/tasks/${taskId}/comments/${commentId}`,
        { commentContent: editedContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, commentContent: editedContent }
              : comment,
          ),
        );
        setEditingCommentId(null);
        setEditedContent('');
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  // 댓글 삭제
  //apiClient.delete(`/tasks/${taskId}/comments/${commentId}`

  const handleDeleteClick = (commentId: string) => {
    const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!isConfirmed) return;

    const accessToken = localStorage.getItem('accessToken');

    apiClient
      .delete(`api/tasks/${taskId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId),
        );
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  };

  return (
    <div>
      <h3 className="text-darkgray mb-2">댓글</h3>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start space-x-3">
            {/** 댓글 유저아바타 */}
            <div className="mt-1 w-8 h-8 rounded-full overflow-hidden">
                <img
                    src={user?.avatar || basicProfileImage}
                    alt={user?.name}
                    // 이미지가 div를 가득 채우도록
                    className="w-full h-full object-cover bg-secondary"
                />
            </div>

            <div className="flex-grow">
              {editingCommentId === comment._id ? (
                <div className="flex flex-row w-full">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg h-[40px] mr-1"
                    style={{ flexBasis: '90%' }}
                  />
                  <button
                    onClick={() => handleEditSave(comment._id)}
                    className="bg-primary text-white text-[12px] font-bold rounded-lg h-[25px] mt-2"
                    style={{ flexBasis: '10%' }}
                  >
                    저장
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-darkgray text-sm">
                    {user?.name}{' '}
                    <span className="text-softgray">({currentDate})</span>
                  </p>
                  <p className="text-darkgray">{comment.commentContent}</p>
                </div>
              )}
            </div>

            <div className="flex flex-row justify-end mt-3">
              <img
                src={editImg}
                alt="edit"
                onClick={() => setEditingCommentId(comment._id)}
                className="mt-[2.2px] mr-3 w-[22px] h-[22px] cursor-pointer"
              />
              <img
                src={trashImg}
                alt="remove"
                onClick={() => {
                  console.log('comment id:', comment._id); // comment.id 값 확인
                  handleDeleteClick(comment._id);
                }}
                className="mr-2 w-[20px] h-[22.5px] cursor-pointer" // hover 시 빨간색으로 변환
                />
            </div>
          </div>
        ))}
      </div>

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
  );
}

export default CommentSection;
