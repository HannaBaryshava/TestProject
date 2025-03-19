import { useState } from 'react';

const useActionState = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        city: '',
        gender: '',
        status: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (data: typeof formData) => {
        const newErrors: { [key: string]: string } = {};

        if (!data.name) newErrors.name = 'Name is required';
        if (!data.email) newErrors.email = 'Email is required';
        if (!data.country) newErrors.country = 'Country is required';
        if (!data.city) newErrors.city = 'City is required';
        if (!data.gender) newErrors.gender = 'Gender is required';
        if (!data.status) newErrors.status = 'Status is required';


        setErrors(newErrors);
        console.log('Updated errors:', newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Request body:', JSON.stringify(formData));

        validateForm(formData);
        if (Object.keys(errors).length > 0) return;

        // const isValid = validateForm(formData);
        // if (!isValid) {
        //     console.log('Form validation failed');
        //     return;
        // }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const text = await response.text();
            console.log('Server text:', text);

            if (!response.ok) {
                console.error('Error response:', text);
                alert('Error creating user');
                return;
            }

            const result = JSON.parse(text);
            console.log('Response Data:', result);

            return result;
        } catch (error) {
            console.error('Error during submission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        errors,
        isSubmitting,
    };
};

export default useActionState;

