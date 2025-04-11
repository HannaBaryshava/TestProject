import FormGroup from "./FormGroup.tsx";
import {Data, IResponse} from './UserForm.tsx';
import { handleModalSubmit } from './action.ts';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { useEffect, useState } from 'react';

const modalContainer = "fixed z-[1] space-y-2 p-6 mx-auto w-full h-full flex items-center justify-center bg-[Rgba(0,0,0,0.4)] left-0 top-0";
const modal = "bg-[white] w-[25em] flex flex-col gap-3 md:gap-4  p-4 md:p-6 lg:p-8 rounded-[10px]";

const commonInput = "mt-1 block w-full p-2 rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300";
const commonSelect = "mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

interface ModalProps {
    onClose: () => void;
    mode: 'edit' | 'delete';
    onConfirmDelete?: () => void;
}

export default function Modal({ onClose, mode, onConfirmDelete }: ModalProps) {
    const navigate = useNavigate();
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

        console.log(formData);

        const result: IResponse<Data> = await handleModalSubmit(formData);

        setUserData(result.data);

        onClose();

        // navigate(0);                //skip?
        //window.location.reload(); //skip
    };

    return (
        <div className={modalContainer}>
            <div className={modal}>
                {mode === 'edit' ? (
                    <>
                <h1 className="mb-8 text-black text-xl md:text-2xl font-bold text-center">Edit user information</h1>
                <form
                    className="flex flex-col gap-1.5">
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

                    <div className="grid md:grid-cols-2 gap-2 md:gap-4">
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

                    <div className="grid md:grid-cols-2 gap-2 md:gap-4">
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
                        <button onClick={handleSubmit}
                            type="submit"
                            className="text-orange-400 bg-white border border-orange-400 rounded-md px-4 py-2 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-300">
                            Save changes
                        </button>
                    </div>
                </form>
                    </>
                ) : (
                    <>
                    <h1 className="text-black text-xl md:text-2xl font-bold text-center">Confirm Deletion</h1>
                    <p className=" text-center">Are you sure you want to delete this user?</p>
                        <div className="flex justify-center space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirmDelete?.();
                                    onClose();
                                }}
                                className="text-orange-400 bg-white border border-orange-400 rounded-md px-4 py-2 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}