import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const UserForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost/my_test_project/backend/public/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email}),
        });
        console.log(response);
        if (response.ok) {
            const result = await response.json();
            console.log('Response Data:', result);
            navigate('/result', {state: result.data});
        } else {
            alert('Error creating user');
        }
    };

    return (
        <div>
            <h1>Create New User</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <br/>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br/>
                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default UserForm;