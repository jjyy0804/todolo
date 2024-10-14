import { create } from 'zustand';

/** 사용자 정보 인터페이스 정의 */
interface User {
  name: string;
  email: string;
  avatar?: string;
  team?: string;
}

/** Zustand 스토어 인터페이스 정의 */
interface UserState {
  user: User | null;
  isAuthenticated: boolean; // 인증 상태
}

/** 유저 액션 정의 */
interface UserActions {
  setUser: (user: User) => void;
  logout: () => void;
}

/** Zustand 스토어 생성 */
const useUserStore = create<UserState & UserActions>((set) => ({
  user: null,
  isAuthenticated: false,
  // 서버로부터 받아오는 유저 정보 셋팅
  setUser: (user: User) =>
    set(() => ({
      user,
      isAuthenticated: true,
    })),
  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),
}));

export default useUserStore;
