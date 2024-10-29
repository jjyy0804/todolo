import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  fetchSchedulesFromServer: (teamId: string, token: string) => Promise<void>;
  clearSchedules: () => void;
}

/** Zustand 스토어 생성 */
const useScheduleStore = create(persist<ScheduleState>(
  (set) => ({
    schedules: [],
    setSchedules: (newSchedules) => set({ schedules: newSchedules }),
    addSchedule: (newSchedule) => set((state) => ({
      schedules: [...state.schedules, newSchedule],
    })),
    removeSchedule: (id) => set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== id),
    })),
    updateSchedule: (id, updatedSchedule) => set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule,
      ),
    })),
    clearSchedules: () => set({ schedules: [] }), // 일정 데이터 초기화

    /** 서버에서 일정을 가져오는 메서드 */
    fetchSchedulesFromServer: async (teamId, token) => {
      try {
        const response = await apiClient.get(`api/teams/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformDataToSchedules = (projects: any[]): Schedule[] => {
          return projects.flatMap((project) => {
            const tasks = Array.isArray(project.tasks)
              ? project.tasks
              : [project.tasks];
            if (!tasks || tasks.length === 0) {
              return [];
            }
            return tasks.map((task: any) => ({
              id: task._id,
              title: task.title,
              content: task.content,
              projectTitle: project.title,
              status: task.status,
              priority: task.priority,
              taskMember: task.task_member_details || [],
              startDate: task.startDate,
              endDate: task.endDate,
              team_id: project.team_id,
              projectColor: project.projectColor || '#FFE1A7',
            }));
          });
        };

        const fetchedProjects = response.data?.data[0]?.projects || [];
        const schedules = transformDataToSchedules(fetchedProjects);
        set({ schedules });
      } catch (error) {
        console.error('서버에서 일정 데이터 가져오기 실패:', error);
      }
    },
  }),
  {
    name: 'schedule-storage',
   // getStorage: () => localStorage,
  }
));

export default useScheduleStore;