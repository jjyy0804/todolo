import { useState } from 'react';
import apiClient from '../../utils/apiClient';

/**서버에 업무 삭제 요청 */
const useDeleteTask = () => {
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  const deleteTask = async (taskId: number) => {
    try {
      setLoading(true); // 로딩 시작
      setError(null); // 이전 에러 초기화

      const token = localStorage.getItem('accessToken'); // JWT 토큰 가져오기
      if (!token) throw new Error('인증이 필요합니다. 로그인 해주세요.');

      await apiClient.delete(`api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true; // 삭제가 성공하면 true 반환
    } catch (error: any) {
      console.error('삭제 요청 중 오류 발생:', error);
      setError(error.message || '일정 삭제에 실패했습니다.');
      return false; // 삭제 실패 시 false 반환
    } finally {
      setLoading(false);
    }
  };
  return { deleteTask, loading, error };
};

export default useDeleteTask;
