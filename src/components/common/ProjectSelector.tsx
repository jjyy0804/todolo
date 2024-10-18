import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/useUserstore';
import apiClient from '../../utils/apiClient';

interface Project {
  id?: number;  // 새 프로젝트는 ID가 필요 없으므로 선택적 필드로 처리
  title: string;
  color: string;
}

const ProjectSelector = () => {
  // const [projects, setProjects] = useState<Project[]>([]);
  // const [projectName, setProjectName] = useState<string>(''); // 새 프로젝트 이름
  // const [projectColor, setProjectColor] = useState<string>('#DFEDF9'); // 새 프로젝트 색상
  // const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null); // 선택된 프로젝트 ID
  // const { user } = useUserStore();
  // const token = localStorage.getItem('accessToken');

  // // API에서 프로젝트 데이터를 가져오기
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await apiClient.get(
  //         `${process.env.REACT_APP_API_BASE_URL}/teams/${user?.team_id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const projectData = response.data.data[0].projects.map((project: any) => ({
  //         id: project._id,  // 서버에서 받은 프로젝트 ID
  //         title: project.title,
  //         color: project.projectColor,
  //       }));
  //       setProjects(projectData); // 가공된 데이터를 상태로 저장
  //     } catch (error) {
  //       console.error('프로젝트 데이터를 가져오는 중 오류 발생:', error);
  //     }
  //   };

  //   fetchProjects(); // 컴포넌트 마운트 시 API 호출
  // }, [user?.team_id]);

  // /** 기존 프로젝트 중 선택 */
  // const handleProjectSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedId = parseInt(event.target.value);
  //   const selectedProject = projects.find((p) => p.id === selectedId);

  //   if (selectedProject) {
  //     setSelectedProjectId(selectedId); // 선택된 프로젝트 ID 업데이트
  //   }
  // };


  // return (
  //   <div className="flex items-center space-x-2">
  //     {/* 기존 프로젝트 선택 */}
  //     <select
  //       className="border border-gray-300 p-2 rounded-[10px] w-6 flex justify-center items-center"
  //       value={selectedProjectId ?? ''}  // value가 selectedProjectId로 설정됨
  //       onChange={handleProjectSelect}   // 선택된 값이 변경될 때 호출됨
  //     >
  //       <option value="">프로젝트 선택</option>
  //       {projects.map((project) => (
  //         <option key={project.id} value={project.id}>
  //           {project.title}
  //         </option>
  //       ))}
  //     </select>

  //     {/* 프로젝트 이름 입력 */}
  //     <input
  //       type="text"
  //       className="border p-2 border-gray-300 rounded-[10px] flex-1 focus:outline-none"
  //       placeholder="프로젝트 이름을 입력하세요"
  //       value={projectName}
  //       onChange={(e) => setProjectName(e.target.value)}
  //     />

  //     {/* 색상 선택 */}
  //     <input
  //       type="color"
  //       className="w-7 h-7 cursor-pointer"
  //       value={projectColor}
  //       onChange={(e) => setProjectColor(e.target.value)}
  //     />
  //   </div>
  // );
};

export default ProjectSelector;
