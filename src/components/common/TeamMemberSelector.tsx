import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
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
  const [isListVisible, setIsListVisible] = useState(false); // 목록 표시 상태
  const { user } = useUserStore();
  const token = localStorage.getItem('accessToken');
  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible); // 버튼 클릭 시 목록의 가시성 토글
  };

  // 팀원 목록 불러오기 (팀 배열만 잘라서 쓰기)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiClient.get(`/api/teams/${user?.team_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 팀원 목록에서 필요한 필드만 추출하고, avatar를 절대 경로로 변환
        const formattedMembers = response.data.data[0].teamMembers.map(
          (member: any) => ({
            id: member._id,
            name: member.name,
            avatar:
              member.avatar && member.avatar.includes('uploads/')
                ? `${window.location.origin}/uploads/${member.avatar.split('uploads/')[1]}` // 절대 경로 변환
                : basicProfile, // 기본 이미지 제공
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
        members
          .filter((member) => member && member.name) // member와 member.name이 존재하는지 확인
          .filter((member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }
  }, [searchTerm, members]);

  // 팀원 선택 핸들러
  const handleSelectMember = (member: TeamMember) => {
    // 이미 선택된 팀원이 아니면 추가
    setSelectedMembers((prevSelectedMembers) => {
      const isAlreadySelected = prevSelectedMembers.some((m) => m.id === member.id);

      // 선택된 팀원이 아닌 경우만 추가
      if (!isAlreadySelected) {
        const newSelectedMembers = [...prevSelectedMembers, member];
        onAddMember(member); // 부모 컴포넌트로 선택한 팀원 전달
        return newSelectedMembers;
      }

      return prevSelectedMembers; // 이미 선택된 팀원일 경우 상태 변경 없음
    });
  };

  return (
    <div>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="팀원을 검색하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-[330px] mb-2"
        />

        {/* 목록을 표시하거나 숨기는 버튼 */}
        <button
          className="hover:bg-hoversecondary text-primary font-medium border border-primary h-10 px-2 py-2 rounded-lg ml-2 mb-1 flex flex-row justify-center items-center"
          onClick={toggleListVisibility}
        >
          {isListVisible ? '숨기기' : '목록'}
        </button>
      </div>
      <div>
        {/* 검색어가 있거나 목록 보기 버튼을 눌렀을 때 팀원 목록을 보여줌 */}
        {(searchTerm || isListVisible) && (
          <ul className="border rounded max-h-48 overflow-y-auto w-[360px]">
            {filteredMembers.map((member) => {
              // 상대 경로를 절대 경로로 변환
              const avatarUrl =
                member.avatar && member.avatar.includes('uploads/')
                  ? `${window.location.origin}/uploads/${member.avatar.split('uploads/')[1]}`
                  : basicProfile; // 기본 이미지 사용

              return (
                <li
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="p-2 flex items-center hover:bg-gray-200 cursor-pointer"
                >
                  <img
                    src={avatarUrl} // 절대 경로로 변환된 avatarUrl 사용
                    alt={`${member.name}의 아바타`}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                    onError={(e) => (e.currentTarget.src = basicProfile)} // 이미지 로딩 실패 시 기본 이미지 표시
                  />
                  {member.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamMemberSelector;
