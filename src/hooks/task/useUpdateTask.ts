import { useState } from 'react';
import { Schedule } from '../../types/scheduleTypes';
import apiClient from '../../utils/apiClient';

const useUpdateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTask = async (taskId: number, updatedData: Partial<Schedule>) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('인증 토큰이 없습니다.');

      const response = await apiClient.put(
        `api/tasks/${taskId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setError(null); // 에러 초기화
      return response.data; // 서버 응답 데이터 반환
    } catch (error) {
      setError(error as Error); // 에러 상태 설정
      throw error; // 호출한 곳에서 에러를 처리하도록 에러를 던짐
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  return { updateTask, loading, error };
};

export default useUpdateTask;
