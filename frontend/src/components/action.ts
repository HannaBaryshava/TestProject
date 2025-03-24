// handleSubmit.ts
"use server"

import { IResponse } from './UserForm';
import { FormData } from './UserForm';

export const handleSubmit = async (
    formData: FormData,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: Function,
    isValidFormData: Function,
    errorMessages: { [key: string]: string }
): Promise<void> => {
    const validationErrors = isValidFormData(formData, errorMessages);
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
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result: IResponse = await response.json();
            console.log('Response Data:', result);
            alert(result.message?.[0] || 'Operation successful');
            navigate('/result', { state: result.data || result });

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
