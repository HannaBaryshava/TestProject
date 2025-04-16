import DataTable from './DataTable';
import Modal from './Modal';
import {useState} from "react";
import {Data} from "./UserForm.tsx";
import {useUserContext} from "../context/UserContext.tsx";

const Home = () => {

    const [ modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');

    const [users, setUsers] = useState<Data[]>([]);
    const { userData } = useUserContext();

    const handleUserAction = ( actionType: 'edit' | 'delete') => {
        setModalMode(actionType);
        setModalOpen(true);
    };

    return (
        <div>
            <hr className="mt-4"/>
            {/*<h1 className="mt-4 text-orange-400 text-3xl font-bold text-center">Home page</h1>*/}
            <DataTable data={users} onEditClick={() => handleUserAction("edit")}

            />
            {modalOpen && <Modal
                mode={modalMode}
                onClose={() => setModalOpen(false)}
                onEdit={(updatedData) => setUsers(prev => {
                    return [...prev].map(u => u.id === userData.id ? updatedData : u);
                })}
            />}
            <hr/>
        </div>
    );
};

export default Home;