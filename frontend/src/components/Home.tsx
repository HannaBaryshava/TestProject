import DataTable from './DataTable';
import Modal from './Modal';
import {useState, useEffect} from "react";
import {Data} from "./UserForm.tsx";
import {useUserContext} from "../context/UserContext.tsx";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');

    const [users, setUsers] = useState<Data[]>([]);
    const {userData, setUserData} = useUserContext();
//
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchUsersData(page);
    }, [page]);

    const fetchUsersData = async (currentPage: number) => { //move to action.ts
        try {
            const response = await fetch(`http://localhost:80/api/users?page=${currentPage}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const newUsers = responseData.data;

            setUsers((prev) => {
                const all = [...prev, ...newUsers];
                const unique = Array.from(new Map(all.map(user => [user.id, user])).values());
                return unique;
            });

            if (newUsers.length < limit) {
                setHasMore(false);
            }
        } catch (err) {
            console.log('Ошибка при получении пользователей:', err);
        }
    };

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
            </InfiniteScroll>
        </div>
    );
};

export default Home;