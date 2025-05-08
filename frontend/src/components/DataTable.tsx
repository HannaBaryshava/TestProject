// DataTable.tsx
import { Data } from './pages/UserForm.tsx';
import {useEffect, useState} from "react";
import { useUserContext } from '../context/UserContext';
import FormGroup from "./ui/FormGroup.tsx";
// import Pagination from './Pagination';
import Modal from './Modal';
import { StatusLabel } from './ui/StatusLabel.tsx';
import { fetchData, deleteUser, deleteSelectedUsers } from '../api/action.ts';

const tableStyles = {
    section: "bg-white flex flex-col gap-2.5 p-2 md:p-4 lg:p-6 rounded-lg shadow-md",
    container: ' overflow-y-auto h-[400px] md:h-[500px] lg:h-[550px] md:overflow-x-auto rounded-lg border border-gray-200 shadow-sm', //h vs min h?
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
    dataSource: 'local' | 'gorest';
}

export interface SortingState {
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
                                      onDelete,
                                      dataSource
                                  }: DataTableProps) {

    const { setUserData } = useUserContext();
    const [filterText, setfilterText] = useState("");
    const [sorting, setSorting ] = useState<SortingState>({column: 'id', order: "asc"});

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isMassDelete, setIsMassDelete] = useState(false);

    useEffect(() => {
        fetchData(sorting, onDataFetched);
    }, []);

    const sortTable = (newSorting: SortingState) => {
        setSorting(newSorting);
        fetchData(newSorting, onDataFetched);
    };

    const handleEdit = (user: Data) => {
        setUserData(user);
    };

    const openDeleteModal = (userId: number) => {  // delete single
        setSelectedUsers(new Set([userId]));
        setIsMassDelete(false);
        setIsDeleteModalOpen(true);
    };

    const openMassDeleteModal = () => { // delete selected
        if (selectedUsers.size > 0) {
            setIsMassDelete(true);
            setIsDeleteModalOpen(true);
        }
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfilterText(event.target.value)
    }

    // console.log("Исходные данные:", JSON.stringify(data, null, 2));
    const filteredValues = data.filter ( data =>
        data.name.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.email.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.country.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.city.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.gender.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
        data.status.toLowerCase().includes(filterText.toLocaleLowerCase())
    );

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
                {filteredValues.map((user) => {
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
            {selectedUsers.size > 1 && (
            <button
                className={tableStyles.deleteButton}
                onClick={openMassDeleteModal}
                disabled={selectedUsers.size === 0}>
                Delete Selected Users
            </button>
            )}
            {isDeleteModalOpen && (
                <Modal
                    mode="delete"
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirmDelete={() => {
                        const idsToDelete = Array.from(selectedUsers);
                        if (isMassDelete) {
                            deleteSelectedUsers(selectedUsers, onDelete, dataSource);
                        } else {
                            // idsToDelete.forEach(id => deleteUser(id, onDelete));
                            idsToDelete.forEach(id => deleteUser(id, onDelete, dataSource));
                        }
                        setIsDeleteModalOpen(false);
                        setSelectedUsers(new Set()); // Очищаем выбор
                    }}
                    message={
                        selectedUsers.size === 1
                            ? `Are you sure you want to delete this user?`   //${Array.from(selectedUsers)[0]} - exact id
                            : `Are you sure you want to delete ${selectedUsers.size} selected users?`
                    }
                    dataSource={dataSource}
                />
            )}

        </section>

    );
}