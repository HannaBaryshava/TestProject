// action.ts
"use server"

import {IResponse} from './UserForm';
import {Data} from './UserForm';

interface ValidationRules {
    required?: boolean,
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

const errorMessages: IResponse<FormData>['errors'] = {
    name: 'Name is required',
    email: 'Email is required',
    country: 'Country is required',
    city: 'City is required',
    gender: 'Gender is required',
    status: 'Status is required'
};

const validationRules: Record<keyof Data, ValidationRules> = {
    id: {},
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Zа-яА-Я\s'-]+$/,
    },
    email: {
        required: true,
        minLength: 5,
        maxLength: 100,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    country: { },
    city: { minLength: 2, maxLength: 50 },
    gender: {},
    status: {}
};

const isValidFormData = (formData: { [key: string]: string }, errorMessages: IResponse<FormData>['errors']): IResponse<FormData>['errors'] => {
    return (Object.keys(formData) as Array<keyof Data>).reduce<IResponse<FormData>['errors']>((acc, key) => {
        // if (!formData[key].trim()) {
        //     acc[key] = errorMessages[key];
        // }
        // return acc;

        const value = formData[key].trim();
        const rules = validationRules[key];
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);

        if (!value) {
            acc[key] = errorMessages[key];
            // acc[key] = `${fieldName} is required`;
            return acc;
        }

        if (rules.minLength && value.length < rules.minLength) {
            acc[key] = `${fieldName} must be a minimum ${rules.minLength} chars`;
            return acc;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            acc[key] = `${fieldName} must be a maximum  ${rules.maxLength} chars`;
            return acc;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            acc[key] = `${fieldName} has invalid format`;
            return acc;
        }

        return acc;

    }, {});
};


export const handleSubmit = async (
    prevState: {
        errors: IResponse<FormData>["errors"],
        data: IResponse<FormData>['data'],
        message: IResponse<FormData>['message']
    },
    formData: FormData,
): Promise<IResponse<FormData>> => {
    console.log(prevState);

    const body: { [key: string]: string } = {};
    for (let entry of formData.entries()) {
        console.log(entry);
        body[entry[0]] = entry[1] as string;
    }
    console.log("Body:", body);

    const result: IResponse<FormData> = {
        errors: {},
        message: [],
        data: {} as FormData,
    };

    const validationErrors = isValidFormData(body, errorMessages);
    // const navigate = useNavigate();

    if (Object.keys(validationErrors).length > 0) {
        result.errors = validationErrors;
        console.log("Result:", result);
        return result;
    }

    try {
        const response = await fetch('http://localhost:80/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('HTTP статус:', response.status);
        console.log('Заголовки:', [...response.headers.entries()]);

        const responseData = await response.json();
        console.log("responseData:", responseData);

        if (response.ok) {

            // alert(result.message?.[0] || 'Operation successful');
            // navigate('/result', {state: result.data || result});

            // return await response.json();

            return {
                data: responseData.data,
                errors: responseData.errors || {},
                message: responseData.message || ['Success'],
                navigation: {
                    path: '/result',
                    state: responseData.data
                }
            };

        } else {
            const errorData: IResponse<Data> = await response.json();
            console.error('Server error details:', errorData);
            alert(`Server error: ${errorData.message?.[0] || 'Unknown error'}`);
            return {
                data: {} as FormData,
                errors: errorData.errors || {},
                message: errorData.message || ['Error']
            };

        }
    } catch (error) {
        console.error('Error during submission:', error);

        alert(`Request failed: Unknown error`);
        return {
            data: {} as FormData,
            errors: {network: 'Failed to connect'},
            message: ['Network error']
        };
    }
};

export const fetchUsers = async (): Promise<IResponse<Data[]>> => {
    try {
        const response = await fetch('http://localhost:80/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        return {
            data: responseData.data || [],
            errors: {},
            message: responseData.message || ['Users loaded successfully'],
        };

    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            data: [],
            errors: { network: 'Failed to fetch users' },
            message: ['Error loading users'],
        };
    }
};


export const handleModalSubmit = async (formData: Data): Promise<IResponse<Data>> => {
    try {
        const response = await fetch(`http://localhost:80/api/users/update/${formData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: formData,
                errors: data.errors || { server: 'Update failed' },
                message: data.message || ['Update error'],
            };
        }

        return {
            data: data.data,
            errors: {},
            message: data.message || ['Update successful'],
        };

    } catch (error) {
        return {
            data: formData,
            errors: { network: 'Connection error' },
            message: ['Network error'],
        };
    }
};