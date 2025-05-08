import DataTable from '../DataTable.tsx';
import Modal from '../Modal.tsx';
import {useState, useEffect} from "react";
import {Data} from "./UserForm.tsx";
import {useUserContext} from "../../context/UserContext.tsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchUsersData } from '../../api/action.ts';

const commonSelect = "mt-1 block p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

const Home = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');

    const [users, setUsers] = useState<Data[]>([]);
    const {userData, setUserData} = useUserContext();
//
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    const [dataSource, setDataSource] = useState<'local' | 'gorest'>('local');

    useEffect(() => {
        const loadUsers = async () => {
            console.log("fetch");

            const newUsers = await fetchUsersData(page, dataSource, limit);

            setUsers((prev) => {
                const all = [...prev, ...newUsers];
                const unique = Array.from(new Map(all.map(user => [user.id, user])).values());
                return unique;
            });

            if (newUsers.length < limit) {
                setHasMore(false);
            }
        };

        loadUsers();
    }, [page, dataSource]);


    useEffect(() => {
        console.log("dataSource")
        setUsers([]);
        setPage(1);
        setHasMore(true);
    }, [dataSource]);

    const loadMore = () => {
        setPage(prev => prev + 1);
    };
//
    const handleUserAction = (actionType: 'edit' | 'delete', user: Data) => {
        setUserData(user);
        setModalMode(actionType);
        setModalOpen(true);
    };
    const handleDelete = (userId: number) => {
        setUsers(prev => prev.filter(user => user.id !== userId));
    };

    return (
        <div>
            {/*<div id = "scrollableDiv"  className='h-[700px] overflow-auto'>*/}
            <hr className="mt-4"/>
            <div className="mb-4 flex justify-center">
                <select
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value as 'local' | 'gorest')}
                    className={commonSelect}
                >
                    <option value="local">Локальная база данных</option>
                    <option value="gorest">gorest REST API</option>
                </select>
            </div>
            <InfiniteScroll
                dataLength={users.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                endMessage={<h4>You're all set</h4>}
            >
                <DataTable data={users}
                           onEditClick={(user) => handleUserAction("edit", user)}
                           onDataFetched={(data) => setUsers(data)}
                           onDelete={handleDelete}
                           dataSource={dataSource}
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
                    dataSource={dataSource}
                />}
                <hr/>
            </InfiniteScroll>
        </div>
    );
};

export default Home;