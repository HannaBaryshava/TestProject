import DataTable from './DataTable';
import Modal from './Modal';
import {useState} from "react";
import {Data} from "./UserForm.tsx";
import {useUserContext} from "../context/UserContext.tsx";

const Home = () => {

    const [ modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');

    const [users, setUsers] = useState<Data[]>([]);
    const { userData, setUserData } = useUserContext();

    const handleUserAction = ( actionType: 'edit' | 'delete', user: Data) => {
        setUserData(user);
        setModalMode(actionType);
        setModalOpen(true);
    };
    const handleDelete = (userId: number) => {
        setUsers(prev => prev.filter(user => user.id !== userId));
    };

    return (
        <div>
            <hr className="mt-4"/>
            {/*<h1 className="mt-4 text-orange-400 text-3xl font-bold text-center">Home page</h1>*/}
            <DataTable  data={users}
                        onEditClick={(user) => handleUserAction("edit", user)}
                        onDataFetched={(data) => setUsers(data)}
                        onDelete={handleDelete}

            />
            {modalOpen && <Modal
                mode={modalMode}
                onClose={() => setModalOpen(false)}
                onEdit={(updatedData) => {
                    if (!userData) return;
                    setUsers(prev => {
                        return prev.map(u => u.id === userData.id ? updatedData : u);
                    });
                }}
                userData={userData}
            />}
            <hr/>
        </div>
    );
};

export default Home;