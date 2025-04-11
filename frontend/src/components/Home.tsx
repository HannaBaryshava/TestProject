import DataTable from './DataTable';
import Modal from './Modal';
import {useState} from "react";

const Home = () => {

    const [ modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');

    const handleUserAction = ( actionType: 'edit' | 'delete') => {
        setModalMode(actionType);
        setModalOpen(true);
    };

    return (
        <div>
            <hr className="mt-4"/>
            {/*<h1 className="mt-4 text-orange-400 text-3xl font-bold text-center">Home page</h1>*/}
            <DataTable onEditClick={() => handleUserAction("edit")}

            />
            {modalOpen && <Modal
                mode={modalMode}
                onClose={() => setModalOpen(false)}
            />}
            <hr/>
        </div>
    );
};

export default Home;