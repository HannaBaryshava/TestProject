// DataTable.tsx
import { Data } from './UserForm.tsx';
import {useEffect, useState, useMemo} from "react";
import { useUserContext } from '../context/UserContext';
import FormGroup from "./FormGroup.tsx";
// import Pagination from './Pagination';
import Modal from './Modal';
import { StatusLabel } from './StatusLabel';

const tableStyles = {
    section: "bg-white flex flex-col gap-2.5 p-2 md:p-4 lg:p-6 rounded-lg shadow-md",
    container: ' overflow-y-auto h-[400px] md:h-[500px] lg:h-[550px]  overflow-x-hidden md:overflow-x-auto rounded-lg border border-gray-200 shadow-sm', //h vs min h?
    table: 'min-w-full table-fixed divide-y divide-gray-200',
    headerRow: 'bg-gray-50',
    headerCell: 'px-2 md:px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider',
    bodyRow: 'hover:bg-gray-50',
    bodyCell: 'p-0.5 md:px-1 lg:px-2 whitespace-nowrap text-sm text-gray-500',
    nameCell: 'font-medium text-gray-900',
    statusBase: 'px-1 md:px-2 inline-flex text-[0.65rem] md:text-xs leading-5 font-semibold rounded-full',
    statusActive: 'bg-green-100 text-green-800',
    statusInactive: 'bg-red-100 text-red-800',
    actionCell: 'px-6 py-4 whitespace-nowrap text-sm font-medium',
    editButton: 'text-orange-600 hover:text-orange-900 mr-4',
    deleteButton: 'text-red-600 hover:text-red-900',
    filterInput: "mt-1 block max-w-full md:max-w-[260px] lg:max-w-[300px] p-0.5 md:p-1 lg:p-2 text-sm md:text-base focus:outline-none rounded-md shadow-sm text-gray-700 hover:bg-orange-100 transition duration-300",
    filterContainer: "p-1 md:px-2 lg:px-4",
};

interface DataTableProps {
    data: Data[];
    onEditClick: (user: Data) => void;
    onDataFetched: (data: Data[]) => void;
    onDelete: (userId: number) => void;
}

interface SortingState {
    column: string;
    order: 'asc' | 'desc';
}
interface HeaderCellProps {
    columnKey: string;
    label: string;
    sorting: SortingState;
    sortTable: (newSorting: SortingState) => void;
    isCheckbox?: boolean;
    onSelectAll?: () => void;
    selectedUsersSize?: number;
    totalUsersSize?: number;
}

const columns = [
    // { key: 'checkbox', label: 'Select all users' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'gender', label: 'Gender' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
];

const HeaderCell: React.FC<HeaderCellProps>  = ({
        columnKey, label, sorting, sortTable,
        isCheckbox, onSelectAll, selectedUsersSize, totalUsersSize}) => {

    if (isCheckbox) {
        return (
            <th className={tableStyles.headerCell}>
                <input
                    type="checkbox"
                    checked={selectedUsersSize === totalUsersSize}
                    onChange={onSelectAll}
                />
            </th>
        );
    }

    const isSortable = columnKey !== 'actions';
    const isDescSorting = sorting.column === columnKey && sorting.order === "desc";
    const isAscSorting   = sorting.column === columnKey && sorting.order === "asc";
    const futureSorterOrder = isDescSorting ? "asc" : "desc";

    return (
        <th className={tableStyles.headerCell}
            onClick={() => isSortable && sortTable ({column: columnKey, order: futureSorterOrder})}>
            {label}
            {isAscSorting && <span> ▲</span>}
            {isDescSorting && <span> ▼</span>}

        </th>
    )
}



export default function DataTable({   data,
                                      onEditClick,
                                      onDataFetched,
                                      onDelete
                                  }: DataTableProps) {

    const { setUserData } = useUserContext();
    // const [users, setUsers] = useState<Data[]>([]);
    const [filterText, setfilterText] = useState("");
    const [sorting, setSorting ] = useState<SortingState>({column: 'id', order: "asc"});

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1000;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

    const fetchData = async (sortParams: SortingState) => {
        const response = await fetch(
            `http://localhost:80/api/users?_sort=${sortParams.column}&_order=${sortParams.order}`
        );
        const result = await response.json();
        // setUsers(data.data || []);
        onDataFetched(result.data || []);
    };

    useEffect(() => {
        fetchData(sorting);
    }, []);

    const sortTable = (newSorting: SortingState) => {
        setSorting(newSorting);
        fetchData(newSorting);
    };

    const handleEdit = (user: Data) => {
        setUserData(user);
    };

    const handleDelete = (userId: number) => {
        fetch(`http://localhost:80/api/users/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(res => res.json())
                .then(() => {
                    onDelete(userId);
                })
                .catch(error => console.error('Error deleting user:', error));
    };

    const openDeleteModal = (userId: number) => {
        setUserIdToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfilterText(event.target.value)
    }

    const filteredValues = data.filter ( data =>
        data.name.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.email.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.country.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.city.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.gender.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.status.toLowerCase().includes(filterText.toLocaleLowerCase())
    );

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredValues.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredValues, currentPage]);

    // const totalPages = Math.ceil(filteredValues.length / itemsPerPage);

    //checkbox
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

    const handleSelectUser = (userId: number) => {
        setSelectedUsers(prevSelected => {
            const updatedSelected = new Set(prevSelected);
            if (updatedSelected.has(userId)) {
                updatedSelected.delete(userId);
            } else {
                updatedSelected.add(userId);
            }
            return updatedSelected;
        });
    };

    const handleSelectAll = () => {
        if (selectedUsers.size === data.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(data.filter(user => user.id !== undefined).map(user => user.id as number)));

        }
    };

    const deleteSelectedUsers = () => {
        const selectedUserIds = Array.from(selectedUsers);
        if (selectedUserIds.length === 0) {
            alert('No users selected for deletion');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedUserIds.length} users?`)) {
            fetch('http://localhost:80/api/users/delete', {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userIds: selectedUserIds })
            })
                .then(res => res.json())
                .then(response => {
                    if (response.message === 'Users deleted successfully') {
                        selectedUserIds.forEach(userId => onDelete(userId));
                    } else {
                        console.error('Error deleting users:', response.errors);
                    }
                })
                .catch(error => console.error('Error deleting users:', error));
        }
    };
    //

    return (
        <section className={tableStyles.section}>
            <div className={tableStyles.filterContainer}>
                <FormGroup
                    title="Enter filter request"
                >
                    <input
                        type="text"
                        name="filter"
                        placeholder="Enter filter value"
                        className={tableStyles.filterInput}
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                </FormGroup>
            </div>
        <div id = "scrollableDiv" className={tableStyles.container}>
            <table className={tableStyles.table}>
                <thead>
                <tr className={tableStyles.headerRow} >

                    <HeaderCell    //union
                        isCheckbox={true}
                        selectedUsersSize={selectedUsers.size}
                        totalUsersSize={data.length}
                        onSelectAll={handleSelectAll}
                        columnKey=""
                        label=""
                        sorting={{ column: "", order: "asc" }}  // Заглушка
                        sortTable={() => {}}  // Заглушка
                    />

                    {columns.map(({ key, label }) => (
                        <HeaderCell  key = {key}
                                     columnKey={key}
                                     label = {label}
                                     sorting = {sorting}
                                     sortTable = {sortTable}
                        />
                    ))}
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((user) => {
                    const { id, status, ...rest } = user;
                    if (id === undefined) return null;
                    return (
                        <tr key={id} className={tableStyles.bodyRow}>
                            <td className={tableStyles.bodyCell}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.has(id)}
                                    onChange={() => handleSelectUser(id)}
                                />
                            </td>
                            {Object.entries(rest).map(([key, value]) => (
                                <td
                                    key={key}
                                    className={`${tableStyles.bodyCell} ${
                                        key === 'name' ? tableStyles.nameCell : ''
                                    }`}
                                >
                                    {value}
                                </td>
                            ))}
                            <td className={tableStyles.bodyCell}>
                                <StatusLabel
                                    status={status}
                                    styles={{
                                        statusBase: tableStyles.statusBase,
                                        statusActive: tableStyles.statusActive,
                                        statusInactive: tableStyles.statusInactive
                                    }}
                                />
                            </td>
                            <td className={tableStyles.actionCell}>
                                <button
                                    onClick={() => {
                                        // handleEdit(id as number);
                                        onEditClick(user);
                                        handleEdit(user);
                                    }}
                                    className={tableStyles.editButton}
                                >
                                    <span className="md:hidden">✏️</span>
                                    <span className="hidden md:inline">Edit</span>
                                </button>
                                <button
                                    onClick={() => openDeleteModal(user.id as number)}
                                    className={tableStyles.deleteButton}
                                >
                                    <span className="md:hidden">🗑️</span>
                                    <span className="hidden md:inline">Delete</span>
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>


            {/*{filteredValues.length > itemsPerPage && (*/}
            {/*    <Pagination*/}
            {/*        currentPage={currentPage}*/}
            {/*        lastPage={totalPages}*/}
            {/*        maxLength={window.innerWidth < 1024 ? 5 : 7}*/}
            {/*        setCurrentPage={setCurrentPage} */}
            {/*    />*/}
            {/*)}*/}
            {isDeleteModalOpen && (
                <Modal
                    mode="delete"
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirmDelete={() => {
                        if (userIdToDelete) {
                            handleDelete(userIdToDelete);
                            setIsDeleteModalOpen(false);
                        }
                    }}
                />
            )}
            <button
                className={tableStyles.deleteButton}
                onClick={deleteSelectedUsers}
                disabled={selectedUsers.size === 0}>
                Delete Selected Users
            </button>
        </section>

    );
}