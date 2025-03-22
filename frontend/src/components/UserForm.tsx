import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import FormGroup from './FormGroup';
// import { useActionState } from 'react';
// import useActionState from './useActionState';

// Типы для стилей элементов
type InputStyle = string;
type SelectStyle = string;

const commonInput: InputStyle = "mt-1 block w-full p-2 rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300";
const commonSelect: SelectStyle = "mt-1 block w-full  p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

type FormData = {
    name: string;
    email: string;
    country: string;
    city: string;
    gender: string;
    status: string;
};

interface IResponse {
    data: FormData;
    errors: Record<string, never>;
    message: string[];
}

// Ошибки (автоматическая генерация на основе FormData) ???
type FormErrors = Partial<Record<keyof FormData, string>>;


const isValidFormData = (formData: FormData): FormErrors => {

    const errorMessages = {
        name: 'Name is required',
        email: 'Email is required',
        country: 'Country is required',
        city: 'City is required',
        gender: 'Gender is required',
        status: 'Status is required'
    };

    return (Object.keys(formData) as Array<keyof FormData>).reduce((acc, key) => {
        if (!formData[key].trim()) {
            acc[key] = errorMessages[key];
        }
        return acc;
    }, {} as FormErrors);
    };




const UserForm = () => { //type!
    // const initialState: FormState = {
    //     errors: {},
    // }
    //
    // const [state, formAction] = useActionState(handleSubmit, {
    //     errors: {},
    //     message: '',
    // });

    const navigate = useNavigate();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        city: '',
        gender: '',
        status: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const validationErrors = isValidFormData(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            console.log('Form validation failed');
            return;
        }

        setIsSubmitting(true);

    try {
        const response = await fetch('http://localhost:80/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result: IResponse  = await response.json();
            console.log('Response Data:', result);
            alert(result.message?.[0] || 'Operation successful');
            navigate('/result', {state: result.data || result});
        } else {
            const errorData: IResponse = await response.json();
            console.error('Server error details:', errorData);
            alert(`Server error: ${errorData.message?.[0] || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error during submission:', error);
        alert(`Request failed: Unknown error`);
    }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-2">
            <h1 className="mb-8 text-black text-2xl font-bold text-center">Create new user</h1>
            <form onSubmit={handleSubmit} className="space-y-1">
                <FormGroup
                    title="Your first and last name:"
                    error={errors.name}
                >
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter first and last name"
                        className={commonInput}
                    />
                </FormGroup>
                <br/>
                <FormGroup
                    title="Email"
                    error={errors.email}
                >
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className={commonInput}
                    />
                </FormGroup>
                <br/>
                <FormGroup
                    title="Country of residence:"
                    error={errors.country}
                >
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className={commonSelect}
                    >
                        <option value="" disabled>
                            Select your country
                        </option>
                        <option value="usa">USA</option>
                        <option value="poland">Poland</option>
                        <option value="belarus">Belarus</option>
                    </select>
                </FormGroup>
                <br/>
                <FormGroup
                    title="City"
                    error={errors.city}
                >
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Enter city"
                        className={commonInput}
                    />
                </FormGroup>
                <br/>
                <FormGroup
                    title="Gender"
                    error={errors.gender}
                >
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className={commonSelect}
                    >
                        <option value="" disabled>
                            Select your gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </FormGroup>
                <br/>
                <FormGroup
                    title="Gender"
                    error={errors.status}
                >
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className={commonSelect}
                    >
                        <option value="" disabled>
                            Select your status
                        </option>
                        <option value="active">Active user</option>
                        <option value="inactive">Inactive user</option>
                    </select>
                </FormGroup>
                <br/>
                <button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0}
                        className="text-orange-400 bg-white border border-orange-400 rounded-md px-4 py-2 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-300">
                    Submit
                </button>
            </form>
        </div>
    );
};
export default UserForm;
