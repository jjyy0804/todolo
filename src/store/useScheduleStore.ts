import { create } from 'zustand';
import axios from 'axios';
//사용자정보 인터페이스( id, name, avatar ), 스케줄 인터페이스 ( id,title,content,projectTitle,status,priority,taskMember,startDate,endDate,team_id )
import { TeamMember, Schedule } from '../types/scheduleTypes';

/** Zustand 스토어 인터페이스 정의 */
interface ScheduleState {
  schedules: Schedule[];
  setSchedules: (newSchedules: Schedule[]) => void;
  addSchedule: (newSchedule: Schedule) => void;
  removeSchedule: (id: number) => void;
  updateSchedule: (id: number, updatedSchedule: Schedule) => void;
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
          ? {
              ...schedule,
              ...updatedSchedule,
            }
          : schedule,
      ),
    })),
  /* 상태 초기화 함수 추가*/
  clearSchedules: () => set({ schedules: [] }), // 일정 데이터 초기화
  /** 서버에서 일정을 가져오는 메서드 추가 */
  fetchSchedulesFromServer: async (teamId, token) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/teams/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      // 데이터 변환
      const transformDataToSchedules = (data: any[]): Schedule[] => {
        const transformedSchedules: Schedule[] = [];

        data.forEach((team) => {
          team.projects.forEach((project: any) => {
            const task = project.tasks;

            const schedule: Schedule = {
              id: task._id, 
              title: task.title,
              content: task.content,
              projectTitle: project.title,
              status: task.status as '할 일' | '진행 중' | '완료',
              priority: task.priority as '높음' | '중간' | '낮음',
              taskMember: task.task_member_details.map((member: any) => ({
                id: member._id,
                name: member.name,
                avatar: member.avatar,
              })) as TeamMember[],
              startDate: task.created_AT,
              endDate: task.updated_AT,
              team_id: team._id,
            };

            transformedSchedules.push(schedule);
          });
        });

        return transformedSchedules;
      };

      // 서버에서 받은 데이터를 변환하여 Zustand 스토어에 저장
      const schedules = transformDataToSchedules(response.data);
      set({ schedules });

    } catch (error) {
      console.error('서버에서 일정 데이터 가져오기 실패:', error);
    }
  },
}));

export default useScheduleStore;
