// DataTable.tsx
// import * as React from 'react';
import { Data } from './UserForm.tsx';
import { useUserContext } from '../context/UserContext';
import {useActionState, useEffect, useState} from "react";
import {handleSubmit} from "./action.ts";
import {IResponse} from "./UserForm.tsx";

const tableStyles = {
    container: 'overflow-x-auto rounded-lg border border-gray-200 shadow-sm',
    table: 'min-w-full divide-y divide-gray-200',
    headerRow: 'bg-gray-50',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    bodyRow: 'hover:bg-gray-50',
    bodyCell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
    nameCell: 'font-medium text-gray-900',
    statusBase: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
    statusActive: 'bg-green-100 text-green-800',
    statusInactive: 'bg-red-100 text-red-800',
};

//
// const users: UserData[] = [
//     {
//         id: 1,
//         name: 'John Doe',
//         email: 'john@example.com',
//         country: 'USA',
//         city: 'New York',
//         gender: 'Male',
//         status: 'Active'
//     },
//     {
//         id: 2,
//         name: 'Jane Smith',
//         email: 'jane@example.com',
//         country: 'Canada',
//         city: 'Toronto',
//         gender: 'Female',
//         status: 'Inactive'
//     },
//     {
//         id: 3,
//         name: 'Bob Johnson',
//         email: 'bob@example.com',
//         country: 'UK',
//         city: 'London',
//         gender: 'Male',
//         status: 'Active'
//     },
// ];

export default function DataTable() {
    // const { userData } = useUserContext();
    // const users = userData ? [userData] : [];
    const [users, setUsers] = useState<Data[]>([]);

    useEffect(() => {
        fetch('http://localhost:80/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.data || []));
    }, []);

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'country', label: 'Country' },
        { key: 'city', label: 'City' },
        { key: 'gender', label: 'Gender' },
        { key: 'status', label: 'Status' }
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
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}