import React, { createContext, useContext, useState } from 'react';

// สร้าง Context
const UserContext = createContext();

// สร้าง Provider สำหรับใช้ UserContext
const UserProvider = ({ children }) => {
    const [UserId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ UserId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

// สร้าง custom hook สำหรับใช้งาน UserContext
const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
