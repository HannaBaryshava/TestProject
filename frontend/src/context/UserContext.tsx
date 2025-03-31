// src/context/UserContext.ts
import {createContext, useContext, useState} from 'react';
import {Data} from '../components/UserForm.tsx';

type UserContextType = {
    userData: Data | null;
    setUserData: (data: Data) => void;
};

const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => {
    },
});

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<Data | null>(null);

    return (
        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);