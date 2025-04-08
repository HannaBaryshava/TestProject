// DataTable.tsx
import { Data } from './UserForm.tsx';
import {useEffect, useState, useMemo} from "react";
import { useUserContext } from '../context/UserContext';
import FormGroup from "./FormGroup.tsx";
import Pagination from './Pagination';
import Modal from './Modal';
import { StatusLabel } from './StatusLabel';

const tableStyles = {
    container: 'overflow-x-auto rounded-lg border border-gray-200 shadow-sm',
    table: 'min-w-full divide-y divide-gray-200',
    headerRow: 'bg-gray-50',
    headerCell: 'px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider',
    bodyRow: 'hover:bg-gray-50',
    bodyCell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
    nameCell: 'font-medium text-gray-900',
    statusBase: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
    statusActive: 'bg-green-100 text-green-800',
    statusInactive: 'bg-red-100 text-red-800',
    actionCell: 'px-6 py-4 whitespace-nowrap text-sm font-medium',
    editButton: 'text-orange-600 hover:text-orange-900 mr-4',
    deleteButton: 'text-red-600 hover:text-red-900',
    filterInput: "mt-1 block max-w-[300px] p-2 rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300",
    filterContainer: "mb-2 p-4",
};

interface DataTableProps {
    onEditClick: () => void;

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
}

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'gender', label: 'Gender' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
];

const HeaderCell: React.FC<HeaderCellProps>  = ({columnKey, label, sorting, sortTable}) => {
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



export default function DataTable({ onEditClick }: DataTableProps) {

    const { setUserData } = useUserContext();
    const [users, setUsers] = useState<Data[]>([]);
    const [filterText, setfilterText] = useState("");
    const [sorting, setSorting ] = useState<SortingState>({column: 'id', order: "asc"});

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

    const fetchData = async (sortParams: SortingState) => {
        const response = await fetch(
            `http://localhost:80/api/users?_sort=${sortParams.column}&_order=${sortParams.order}`
        );
        const data = await response.json();
        setUsers(data.data || []);
    };

    useEffect(() => {
        fetchData(sorting);
    }, []);

    const sortTable = (newSorting: SortingState) => {
        setSorting(newSorting);
        fetchData(newSorting);
    };

    const handleEdit = (user: Data, userId: number) => {
        alert('Edit user with ID:' + userId);
        setUserData(user);
    };

    const handleDelete = (userId: number) => {
        // if (window.confirm('Are you sure you want to delete user with ID: '+ userId + ' ?')) { //any other way to confirm?
            fetch(`http://localhost:80/api/users/delete/${userId}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(() => {

                    setUsers(users.filter(user => user.id !== userId));
                })
                .catch(error => console.error('Error deleting user:', error));
        // }
    };

    const openDeleteModal = (userId: number) => {
        setUserIdToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfilterText(event.target.value)
    }

    const filteredValues = users.filter ( users =>
        users.name.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        users.email.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        users.country.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        users.city.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        users.gender.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        users.status.toLowerCase().includes(filterText.toLocaleLowerCase())
    );

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredValues.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredValues, currentPage]);

    const totalPages = Math.ceil(filteredValues.length / itemsPerPage);


    return (
        <div className={tableStyles.container}>
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

            <table className={tableStyles.table}>
                <thead>
                <tr className={tableStyles.headerRow} >
                    {columns.map(({ key, label }) => (
                        <HeaderCell  key = {key}
                                     columnKey={key}
                                     label = {label}
                                     sorting = {sorting}
                                     sortTable = {sortTable}/>
                    ))}
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((user) => {
                    const { id, status, ...rest } = user;
                    return (
                        <tr key={id} className={tableStyles.bodyRow}>
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
                                        onEditClick();
                                        handleEdit(user, id as number);
                                    }}
                                    className={tableStyles.editButton}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDeleteModal(user.id as number)}
                                    className={tableStyles.deleteButton}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            {filteredValues.length > itemsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    lastPage={totalPages}
                    maxLength={7}
                    setCurrentPage={setCurrentPage}
                />
            )}
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
        </div>
    );
}