import { create } from 'zustand';
import apiClient from '../utils/apiClient';
// 사용자 정보 인터페이스( id, name, avatar ), 스케줄 인터페이스 ( id, title, content, projectTitle, status, priority, taskMember, startDate, endDate, team_id )
import { TeamMember, Schedule } from '../types/scheduleTypes';

/** Zustand 스토어 인터페이스 정의 */
interface ScheduleState {
  schedules: Schedule[];
  setSchedules: (newSchedules: Schedule[]) => void;
  addSchedule: (newSchedule: any) => void;
  removeSchedule: (id: number) => void;
  updateSchedule: (id: number, updatedSchedule: any) => void;
  fetchSchedulesFromServer: (teamId: string, token: string) => Promise<void>; // 서버에서 일정 가져오기 함수
  clearSchedules: () => void;
}

/** Zustand 스토어 생성 */
const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  setSchedules: (newSchedules) => set({ schedules: newSchedules }),

  addSchedule: (newSchedule) =>
    set((state) => ({
      schedules: [...state.schedules, newSchedule],
    })),

  removeSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== id),
    })),

  updateSchedule: (id, updatedSchedule) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, ...updatedSchedule }
          : schedule
      ),
    })),

  /* 상태 초기화 함수 추가 */
  clearSchedules: () => set({ schedules: [] }), // 일정 데이터 초기화

  /** 서버에서 일정을 가져오는 메서드 */
  fetchSchedulesFromServer: async (teamId, token) => {
    try {
      const response = await apiClient.get(`/api/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      // 데이터 변환(schedules 배열 스토어에 저장할 데이터 형식으로)
      const transformDataToSchedules = (projects: any[]): Schedule[] => {
        return projects.flatMap((project) => {
          const tasks = Array.isArray(project.tasks) ? project.tasks : [project.tasks]; // tasks가 배열인지 확인하고 배열로 처리
          if (!tasks || tasks.length === 0) {
            console.log('프로젝트에 tasks가 없습니다.');
            return [];
          }

          return tasks.map((task: any) => ({
            id: task._id, // task id
            title: task.title, // task 제목
            content: task.content, // task 내용
            projectTitle: project.title, // 프로젝트 제목
            status: task.status, // 상태 ('할 일', '진행 중', '완료')
            priority: task.priority, // 우선순위 ('높음', '중간', '낮음')
            taskMember: task.task_member_details || [], // 팀 멤버
            startDate: task.startDate, // 시작 날짜
            endDate: task.endDate, // 종료 날짜
            team_id: project.team_id, // 팀 ID
            projectColor: project.projectColor || '#FFE1A7', // 프로젝트 색상 또는 기본 색상
          }));
        });
      };

      // 프로젝트 데이터 가져오기
      const fetchedProjects = response.data?.data[0]?.projects || [];
      console.log('Fetched Projects:', fetchedProjects);

      // 변환된 데이터를 Zustand 스토어에 저장
      const schedules = transformDataToSchedules(fetchedProjects);
      set({ schedules });

      // 상태가 잘 업데이트되었는지 확인
      console.log('현재 스토어에 저장된 스케줄:', useScheduleStore.getState().schedules);
    } catch (error) {
      console.error('서버에서 일정 데이터 가져오기 실패:', error);
    }
  },
}));

export default useScheduleStore;
