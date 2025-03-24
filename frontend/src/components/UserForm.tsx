"use client"

import {useActionState, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import FormGroup from './FormGroup';
import { handleSubmit } from './action.ts';
// import { useActionState } from 'react';


// Типы для стилей элементов
type InputStyle = string;
type SelectStyle = string;

const commonInput: InputStyle = "mt-1 block w-full p-2 rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300";
const commonSelect: SelectStyle = "mt-1 block w-full  p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

export type Data = {
    name: string;
    email: string;
    country: string;
    city: string;
    gender: string;
    status: string;
};

export interface IResponse<T> {
    data: T;
    errors: Record<string, string>;
    message: string[];
}



export const UserForm = () => {  //type!
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

    // const initialState: FormState = {
    //     errors: {},
    // }
    //
    const [state, formAction, isPending] = useActionState<IResponse<FormData>>(handleSubmit, {
        errors: {},
        message: [],
        data: {}
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-2">
            <h1 className="mb-8 text-black text-2xl font-bold text-center">Create new user</h1>
            <form

                    action={formAction}
                    className="space-y-1">
                <FormGroup
                    title="Your first and last name:"
                    error={state.errors.name}
                >
                    <input
                        type="text"
                        name="name"
                        // value={formData.name}
                        // onChange={handleChange}
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
