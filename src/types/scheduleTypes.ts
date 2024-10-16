export interface TeamMember {
  id: number;
  name: string;
  avatar?: string;
}

export interface Schedule {
  id: number;
  title: string;
  content: string;
  projectTitle: string;
  status: '할 일' | '진행 중' | '완료';
  priority: '높음' | '중간' | '낮음';
  taskMember: TeamMember[];
  startDate: string;
  endDate: string;
  team_id?: string;
}
