import { useLocation } from 'react-router-dom';
// import { useContext } from 'react';

const UserResult = () => {
    const location = useLocation();
    const {
        name = '',
        email = '',
        country = '',
        city = '',
        gender = '',
        status = ''
    } = location.state || {};


    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold text-center">User Created</h1>
            <div className="space-y-2">
                <p><strong className="text-gray-700">Name:</strong> {name}</p>
                <p><strong className="text-gray-700">Email:</strong> {email}</p>
                <p><strong className="text-gray-700">Country of residence:</strong> {country}</p>
                <p><strong className="text-gray-700">City:</strong> {city}</p>
                <p><strong className="text-gray-700">Gender:</strong> {gender}</p>
                <p><strong className="text-gray-700">Status:</strong> {status}</p>
            </div>
            <a href="/" className="block text-center text-orange-400 hover:text-orange-500 transition duration-300">
                Back to Home
            </a>
        </div>
    );
};

export default UserResult;