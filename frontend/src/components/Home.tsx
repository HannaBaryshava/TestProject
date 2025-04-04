import DataTable from './DataTable';
import Modal from './Modal';
import {useState} from "react";

const Home = () => {

    const [ modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <hr className="mt-8 "/>
            <h1 className="mt-8 mb-8 text-orange-400 text-4xl font-bold text-center">Home page</h1>
            <DataTable onEditClick={() => setModalOpen(true)} />
            {modalOpen && <Modal onClose={() => setModalOpen(false)}/>}
            <hr/>
        </div>
    );
};

export default Home;