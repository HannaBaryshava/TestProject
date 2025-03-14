import { useLocation } from 'react-router-dom';

const UserResult = () => {
    const location = useLocation();
    const { name, email } = location.state || { name: '', email: '' };

    return (
        <div>
            <h1>User Created</h1>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            <a href="/">Back to Home</a>
        </div>
    );
};

export default UserResult;