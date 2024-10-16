import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TeamMember } from '../../types/scheduleTypes'; //사용자정보 인터페이스( id, name, avatar )

const TeamMemberSelector = ({
  onAddMember,
}: {
  onAddMember: (member: TeamMember) => void;
}) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);

  // 팀원 목록 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/teams/members'); // 서버에서 팀원 목록 불러오기
        setMembers(response.data);
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
    if (!selectedMembers.some((m) => m.id === member.id)) {
      const newSelectedMembers = [...selectedMembers, member];
      setSelectedMembers(newSelectedMembers);
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
      <div className="mt-4">
        <h4>선택된 팀원:</h4>
        <ul>
          {/* {selectedMembers.map((member) => (
            <li key={member.id} className="p-1 flex items-center">
              <img
                src={member.avatar}
                alt={`${member.name}의 아바타`}
                className="w-6 h-6 rounded-full mr-2 object-cover"
              />
              {member.name}
            </li>
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default TeamMemberSelector;
