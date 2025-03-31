import {useUserContext} from '../context/UserContext';
import { Data } from './UserForm.tsx';

const UserResult = () => {
    const { userData } = useUserContext();
    type UserField = {
        key: keyof Data;
        label: string;
    };

    if (!userData) {
        return <p>No user data found</p>;
    }

    const userFields: UserField[] = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'country', label: 'Country of residence' },
        { key: 'city', label: 'City' },
        { key: 'gender', label: 'Gender' },
        { key: 'status', label: 'Status' }
    ];

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold text-center">User Created</h1>
            <div className="space-y-2">
                {userFields.map((field) => (
                    <p key={field.key}>
                        <strong className="text-gray-700">{field.label}:</strong> {userData[field.key]}
                    </p>
                ))}
            </div>
            <a href="/" className="block text-center text-orange-400 hover:text-orange-500 transition duration-300">
                Back to Home
            </a>
        </div>
    );
};

export default UserResult;