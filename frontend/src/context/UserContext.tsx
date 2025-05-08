// src/context/UserContext.ts
import {createContext, useContext, useState} from 'react';
import {Data} from '../components/pages/UserForm.tsx';

// type DataSource = 'local' | 'gorest';

type UserContextType = {
    userData: Data | null;
    setUserData: (data: Data) => void;
    // dataSource: DataSource;
    // setDataSource: (source: DataSource) => void;
};

const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => {
    }
    // dataSource: 'local',
    // setDataSource: () => {},
});

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<Data | null>(null);
    // const [dataSource, setDataSource] = useState<DataSource>('local');

    return (
        <UserContext.Provider value={{
            userData,
            setUserData}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);