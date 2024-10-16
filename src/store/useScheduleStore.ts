import { create } from 'zustand';
//사용자정보 인터페이스( id, name, avatar ), 스케줄 인터페이스 ( id,title,content,projectTitle,status,priority,taskMember,startDate,endDate,team_id )
import { TeamMember, Schedule } from '../types/scheduleTypes';

/** Zustand 스토어 인터페이스 정의 */
interface ScheduleState {
  schedules: Schedule[];
  setSchedules: (newSchedules: Schedule[]) => void;
  addSchedule: (newSchedule: Schedule) => void;
  removeSchedule: (id: number) => void;
  updateSchedule: (id: number, updatedSchedule: Schedule) => void;
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
}));

export default useScheduleStore;
