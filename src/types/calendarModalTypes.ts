// 댓글 인터페이스 정의
export interface Comment {
  id: number;
  user: string;
  date: string;
  content: string;
}

export interface TeamMember {
    name: string;
    avatar: string;
  }
  
export interface Task {
    title: string;
    date: string;
    projectName: string;
    teamMembers: TeamMember[];
    details: string;
    comments: Comment[];
}