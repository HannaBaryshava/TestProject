// DataTable.tsx
import { Data } from './UserForm.tsx';
import {useEffect, useState} from "react";
import { useUserContext } from '../context/UserContext';

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
    deleteButton: 'text-red-600 hover:text-red-900'
};

interface DataTableProps {
    onEditClick: () => void;
}


export default function DataTable({ onEditClick }: DataTableProps) {

    const { setUserData } = useUserContext();
    const [users, setUsers] = useState<Data[]>([]);

    useEffect(() => {
        fetch('http://localhost:80/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.data || []));
    }, []);

    const handleEdit = (user: Data, userId: number) => {
    // const handleEdit = (userId: number) => {
        alert('Edit user with ID:' + userId);
        setUserData(user);
    };

    const handleDelete = (userId: number) => {
        // alert('Delete user with ID:' + userId);
        if (window.confirm('Are you sure you want to delete user with ID: '+ userId + ' ?')) { //any other way to confirm?
            fetch(`http://localhost:80/api/users/delete/${userId}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(() => {

                    setUsers(users.filter(user => user.id !== userId));
                })
                .catch(error => console.error('Error deleting user:', error));
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'country', label: 'Country' },
        { key: 'city', label: 'City' },
        { key: 'gender', label: 'Gender' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderStatus = (status: string) => (
        <span className={`${tableStyles.statusBase} ${
            status === 'active'
                ? tableStyles.statusActive
                : tableStyles.statusInactive
        }`}>
            {status}
        </span>
    );

    return (
        <div className={tableStyles.container}>
            <table className={tableStyles.table}>
                <thead>
                <tr className={tableStyles.headerRow}>
                    {columns.map(({ key, label }) => (
                        <th key={key} className={tableStyles.headerCell}>
                            {label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {users.map((user) => {
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
                                {renderStatus(status)}
                            </td>
                            <td className={tableStyles.actionCell}>
                                <button
                                    onClick={() => {
                                        // handleEdit(id as number);
                                        handleEdit(user, id as number);
                                        onEditClick();
                                    }}
                                    className={tableStyles.editButton}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(id as number)}
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
        </div>
    );
}