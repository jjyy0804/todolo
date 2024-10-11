import { create } from 'zustand';
/**팀원 정보 인터페이스 */
interface TeamMember {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  scheduleName: string;
  projectName: string;
  scheduleContent: string;
  status: '할 일' | '진행 중' | '완료';
  priority: '높음' | '중간' | '낮음';
  teamMembers: TeamMember[];
  startDate: string;
  endDate: string;
}
/** Zustand 스토어 인터페이스 정의 */
interface ScheduleState {
  schedules: Schedule[];
  addSchedule: (newSchedule: Schedule) => void;
  removeSchedule: (id: number) => void;
}
/** Zustand 스토어 생성 */
const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  addSchedule: (newSchedule) =>
    set((state) => ({
      schedules: [...state.schedules, newSchedule],
    })),
  removeSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== id),
    })),
}));

export default useScheduleStore;
