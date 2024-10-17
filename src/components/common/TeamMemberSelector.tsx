import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TeamMember } from '../../types/scheduleTypes'; // 사용자정보 인터페이스
import useUserStore from '../../store/useUserstore';
import basicProfile from '../../assets/images/basic_user_profile.png';

const TeamMemberSelector = ({
  onAddMember,
}: {
  onAddMember: (member: TeamMember) => void;
}) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]); // 선택된 팀원 리스트
  const { user } = useUserStore();
  const token = localStorage.getItem('accessToken');
  // 팀원 목록 불러오기 (팀 배열만 잘라서 쓰기)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/teams/${user?.team_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('API 응답:', response.data.data[0].teamMembers); // 응답 데이터 확인
        // response.data.teamMembers에서 필요한 필드만 추출
        const formattedMembers = response.data.data[0].teamMembers.map(
          (member: any) => ({
            id: member._id, // _id를 id로 매핑
            name: member.name,
            avatar: member.avatar !== 'N/A' ? member.avatar : basicProfile, // avatar가 없을 경우 기본 이미지 제공
          }),
        );

        setMembers(formattedMembers); // 인터페이스에 맞게 변환된 데이터로 상태 업데이트
      } catch (error) {
        console.error('팀원 목록을 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    fetchMembers();
  }, []);

  // 검색 필터 적용
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(
        members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
  }, [searchTerm, members]);

  // 팀원 선택 핸들러
  const handleSelectMember = (member: TeamMember) => {
    // 이미 선택된 팀원이 아닐 때만 추가
    if (!selectedMembers.some((m) => m.id === member.id)) {
      const newSelectedMembers = [...selectedMembers, member];
      setSelectedMembers(newSelectedMembers); // 선택된 팀원 리스트 업데이트
      onAddMember(member); // 부모 컴포넌트로 선택한 팀원 전달
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="팀원을 검색하세요."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <ul className="border rounded max-h-48 overflow-y-auto">
        {filteredMembers.map((member) => (
          <li
            key={member.id}
            onClick={() => handleSelectMember(member)}
            className="p-2 flex items-center hover:bg-gray-200 cursor-pointer"
          >
            <img
              src={member.avatar}
              alt={`${member.name}의 아바타`}
              className="w-8 h-8 rounded-full mr-2 object-cover"
              onError={
                (e) => (e.currentTarget.src = 'https://via.placeholder.com/150') // 이미지 로딩 실패 시 기본 이미지 표시
              }
            />
            {member.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMemberSelector;
