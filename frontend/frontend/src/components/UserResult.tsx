import { useLocation } from 'react-router-dom';

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
        <div>
            <h1>User Created</h1>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Country of residence:</strong> {country}</p>
            <p><strong>City:</strong> {city}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Status:</strong> {status}</p>
            <a href="/">Back to Home</a>
        </div>
    );
};

export default UserResult;