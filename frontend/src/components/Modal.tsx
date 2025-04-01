import FormGroup from "./FormGroup.tsx";
import { Data } from './UserForm.tsx';

import { useUserContext } from '../context/UserContext';
import { useEffect, useState } from 'react';

const modalContainer = "fixed z-[1] space-y-2 p-6 mx-auto w-full h-full flex items-center justify-center bg-[Rgba(0,0,0,0.4)] left-0 top-0";
const modal = "bg-[white] w-[25em] p-8 rounded-[5px]";

const commonInput = "mt-1 block w-full p-2 rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300";
const commonSelect = "mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

interface ModalProps {
    onClose: () => void;
}

export default function Modal({ onClose }: ModalProps) {
    const { userData, setUserData } = useUserContext();
    const [formData, setFormData] = useState<Data>(userData as Data);

    useEffect(() => {
        if (userData) {
            setFormData(userData);
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            const userId = userData?.id;

            const response = await fetch(`http://localhost:80/api/users/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('User updated successfully:', result);
                setUserData(formData);
                onClose();
            } else {
                const error = await response.json();
                console.error('Error updating user:', error);
                alert('Failed to update user');
            }
        } catch (error) {

            console.error('Network error:', error);
            alert('Failed to update user');
        }
    };

    return (
        <div className={modalContainer}>
            <div className={modal}>
                <h1 className="mb-8 text-black text-2xl font-bold text-center">Edit user information</h1>
                <form onSubmit={handleSubmit}
                    className="space-y-1">
                    <FormGroup
                        title="Full name"
                        error={undefined}
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            className={commonInput}
                            value={formData.name}
                            onChange={handleChange}

                        />
                    </FormGroup>

                    <FormGroup
                        title="Email"
                        error={undefined}
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            className={commonInput}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup
                            title="Country"
                            error={undefined}
                        >
                            <input
                                type="text"
                                name="country"
                                placeholder="Enter country"
                                className={commonInput}
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup
                            title="City"
                            error={undefined}
                        >
                            <input
                                type="text"
                                name="city"
                                placeholder="Enter city"
                                className={commonInput}
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup
                            title="Gender"
                            error={undefined}
                        >
                            <select
                                name="gender"
                                className={commonSelect}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </FormGroup>

                        <FormGroup
                            title="Status"
                            error={undefined}
                        >
                            <select
                                name="status"
                                className={commonSelect}
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </FormGroup>
                    </div>
                    <div className="flex justify-center space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                        <button
                            type="submit"
                            className="text-orange-400 bg-white border border-orange-400 rounded-md px-4 py-2 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-300">
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}