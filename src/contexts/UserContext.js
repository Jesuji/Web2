//앱에서 전역으로 사용될 유저정보들 관리 (닉네임, 국적)
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    nickname: '',
    nationality: '',
    // 추가적인 유저 정보들
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


// userContext를 사용하기 위한 커스텀 훅
export const useUser = () => useContext(UserContext);