// action.ts
"use server"

import {IResponse} from './UserForm';
import {Data} from './UserForm';
import {useNavigate} from "react-router-dom";

const isValidFormData = (formData: Data, errorMessages: IResponse<FormData>['errors']): IResponse<FormData>['errors'] => {
    return (Object.keys(formData) as Array<keyof Data>).reduce<IResponse<FormData>['errors']>((acc, key) => {
        if (!formData[key].trim()) {
            acc[key] = errorMessages[key];
        }
        return acc;
    }, {});
};

const errorMessages: IResponse<FormData>['errors'] = {
    name: 'Name is required',
    email: 'Email is required',
    country: 'Country is required',
    city: 'City is required',
    gender: 'Gender is required',
    status: 'Status is required'
};


export const handleSubmit = async (
    prevState: {
        errors: IResponse<FormData>["errors"],
        data: IResponse<FormData>['data'],
        message: IResponse<FormData>['message']
    },
    formData: FormData,
    // navigate: Function,
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
        data: {} as FormData
    };

    const validationErrors = {}; //isValidFormData(formData, errorMessages);
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

            alert(result.message?.[0] || 'Operation successful');
            // navigate('/result', {state: result.data || result});

            // return await response.json();

            return {
                data: responseData.data,
                errors: responseData.errors || {},
                message: responseData.message || ['Success']
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
