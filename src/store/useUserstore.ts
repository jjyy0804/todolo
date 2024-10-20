import { create } from 'zustand';

/** 사용자 정보 인터페이스 정의 */
export interface User {
  name: string;
  email: string;
  avatar?: string;
  team?: string;
  team_id?: string;
}

/** Zustand 스토어 인터페이스 정의 */
interface UserState {
  user: User | null;
  isAuthenticated: boolean; //인증 상태
  isLoading: boolean; //로딩 상태
}

/** 유저 액션 정의 */
interface UserActions {
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void; //로딩 상태 (비동기 작업 수행 시 로딩 상태 필요)
}

/** Zustand 스토어 생성 */
const useUserStore = create<UserState & UserActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  // 서버로부터 받아오는 유저 정보 셋팅
  setUser: (user: User) =>
    set(() => ({
      user,
      isAuthenticated: true,
      isLoading: false, //유저 셋팅 후 로딩 완료
    })),
  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })),
  //로딩 상태 업데이트
  setLoading: (isLoading: boolean) =>
    set(() => ({
      isLoading,
    })),
}));

export default useUserStore;
