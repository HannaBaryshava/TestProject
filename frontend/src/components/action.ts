// handleSubmit.ts
"use server"

import { IResponse } from './UserForm';
import { Data } from './UserForm';

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
    prevState: {errors: IResponse<FormData>["errors"], data: IResponse<FormData>['data'], message: IResponse<FormData>['message']},
    formData: FormData,
    // setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    // setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
    // navigate: Function,
    // isValidFormData: Function,
    // errorMessages: { [key: string]: string }
): Promise<IResponse<FormData | null>> => {
    console.log(prevState);
    const body = {};
    for (let entry of formData.entries()){
        console.log(entry);
        body[key as keyof Data] = value;
    }

    const result: IResponse<FormData|null> = {
        errors: {},
        message: [],
        data: null
    };

    const validationErrors = isValidFormData(formData, errorMessages);

    if (Object.keys(validationErrors).length > 0) {
        result.errors = validationErrors;
        return  result;
    }


    try {
        const response = await fetch('http://localhost:80/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData,
        });

        if (response.ok) {
            return await response.json();
            console.log('Response Data:', result);
            alert(result.message?.[0] || 'Operation successful');
            navigate('/result', { state: result.data || result });

        } else {
            const errorData: IResponse<Data> = await response.json();
            console.error('Server error details:', errorData);
            alert(`Server error: ${errorData.message?.[0] || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error during submission:', error);
        alert(`Request failed: Unknown error`);

    }
};
