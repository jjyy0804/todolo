import React from 'react';
import useUserStore from '../../store/useUserstore';
import BasicImage from '../../assets/images/basic_user_profile.png';

interface MyProfileProps {
  openUserInfoModal: () => void; // 부모로부터 내려받을 함수의 타입 정의
}
const MyProfile: React.FC<MyProfileProps> = ({ openUserInfoModal }) => {
  const { user } = useUserStore();
  // 상대 경로를 절대 경로로 변환
  const avatarUrl = user?.avatar ? user.avatar : BasicImage; // 기본 이미지 사용

  return (
    <div>
      <div className="flex items-start space-x-2 mt-14 ml-8 z-999">
        <img
          src={avatarUrl}
          alt="Profile_Img"
          className="w-[40px] h-[40px] rounded-full cursor-pointer"
          onClick={openUserInfoModal}
          onError={(e) => (e.currentTarget.src = `${BasicImage}`)} // 오류 시 기본 이미지로 대체
        />
        <div>
          <h4 className="text-[17px] font-regular mt-2">
            {user?.name} ({user?.team || '소속팀을 설정하세요'})
          </h4>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
