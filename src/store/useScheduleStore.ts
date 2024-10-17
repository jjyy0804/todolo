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
        `${process.env.REACT_APP_API_BASE_URL}/teams/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      // 데이터 변환
      const transformDataToSchedules = (data: any): Schedule[] => {
        const transformedSchedules: Schedule[] = [];

        // data가 배열인지 확인하고, 그렇지 않으면 빈 배열 처리
        const dataArray = Array.isArray(data) ? data : [data];

        dataArray.forEach((team: any) => {
          if (team.projects && Array.isArray(team.projects)) {
            team.projects.forEach((project: any) => {
              const tasks = project.tasks;

              // 단일 객체인지 배열인지 확인하고 처리
              if (Array.isArray(tasks)) {
                tasks.forEach((task: any) => {
                  const schedule: Schedule = {
                    id: task._id,
                    title: task.title,
                    content: task.content,
                    projectTitle: project.title,
                    status: task.status as '할 일' | '진행 중' | '완료',
                    priority: task.priority as '높음' | '중간' | '낮음',
                    taskMember: task.task_member_details?.map(
                      (member: any) => ({
                        id: member._id,
                        name: member.name,
                        avatar: member.avatar,
                      }),
                    ) as TeamMember[],
                    startDate: task.created_AT,
                    endDate: task.updated_AT,
                    team_id: team._id,
                  };

                  transformedSchedules.push(schedule);
                });
              } else if (tasks && tasks._id) {
                // 단일 객체일 경우 처리
                const schedule: Schedule = {
                  id: tasks._id,
                  title: tasks.title,
                  content: tasks.content,
                  projectTitle: project.title,
                  status: tasks.status as '할 일' | '진행 중' | '완료',
                  priority: tasks.priority as '높음' | '중간' | '낮음',
                  taskMember: tasks.task_member_details?.map((member: any) => ({
                    id: member._id,
                    name: member.name,
                    avatar: member.avatar,
                  })) as TeamMember[],
                  startDate: tasks.created_AT,
                  endDate: tasks.updated_AT,
                  team_id: team._id,
                };

                transformedSchedules.push(schedule);
              }
            });
          } else {
            console.log('프로젝트 데이터가 없습니다.');
          }
        });

        return transformedSchedules;
      };

      // 변환된 데이터를 Zustand 스토어에 저장
      const schedules = transformDataToSchedules(response.data?.data || []);
      set({ schedules });
    } catch (error) {
      console.error('서버에서 일정 데이터 가져오기 실패:', error);
    }
  },
}));

export default useScheduleStore;
