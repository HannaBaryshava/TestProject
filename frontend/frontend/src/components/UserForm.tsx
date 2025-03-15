import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const UserForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, country, city, gender, status })
        });
        console.log(response);
        if (response.ok) {
            const result = await response.json();
            console.log('Response Data:', result);
            navigate('/result', {state: result.data});
        } else {
            const errorData = await response.json();
            console.error('Error Data:', errorData);
            alert('Error creating user');
        }
    };

    return (
        <div>
            <h1>Create new user</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Your first and last name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter first and last name"
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enetr email"
                    />
                </label>
                <br />
                <label>
                    Country of residence:
                    <select
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select your country
                        </option>
                        <option value="usa">USA</option>
                        <option value="poland">Poland</option>
                        <option value="belarus">Belarus</option>
                    </select>
                </label>
                <br />
                <label>
                    City:
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Enter city"
                    />
                </label>
                <br />
                <label>
                    Gender:
                    <select
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select your gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>
                <br />
                <label>
                    Status:
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select your status
                        </option>
                        <option value="active">Active user</option>
                        <option value="inactive">Inactive user</option>
                    </select>
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
export default UserForm;