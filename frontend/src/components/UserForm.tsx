"use client"

import {useActionState, useEffect} from 'react';
import FormGroup from './FormGroup';
import {handleSubmit} from './action.ts';
import {useNavigate} from "react-router-dom";
import { useUserContext } from '../context/UserContext';

const commonInput = "mt-1  w-full p-2 rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300";
const commonSelect = "mt-1 w-full  p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

export type Data = {
    id?: number;
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
    navigation?: {
        path: string;
        state: unknown;
    };
}

export const UserForm    = () => {  //type!
    const navigate = useNavigate();
    const { setUserData } = useUserContext();
    const [state, formAction, isPending] = useActionState<IResponse<FormData>, FormData>(handleSubmit, {
        errors: {},
        message: [],
        data: {} as FormData
    });

    useEffect(() => {
        if (state?.navigation) {
            if (state.navigation.state) {
                setUserData(state.navigation.state as Data);
            }
            navigate(state.navigation.path, {
                state: state.navigation.state,
            });
        }
    }, [state, navigate, setUserData]);

    // useEffect(() => {
    //     if (state?.data) {
    //         setUserData(state.data as Data); //?
    //         navigate('/result');
    //     }
    // }, [state, navigate, setUserData]);


    return (
        <div className="lg:p-6 p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-2">
            <h1 className="mb-8 text-black text-xl md:text-2xl font-bold text-center">Create new user</h1>
            <form
                action={formAction}
                className="flex flex-col gap-1.5">
                <FormGroup
                    title="First and last name"
                    error={state.errors.name}
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter first and last name"
                        className={commonInput}
                    />
                </FormGroup>
                <br/>
                <FormGroup
                    title="Email"
                    error={state.errors.email}
                >
                    <input
                        type="email" //text?
                        name="email"
                        placeholder="Enter email"
                        className={commonInput}
                    />
                </FormGroup>
                <br/>
                <FormGroup
                    title="Country of residence"
                    error={state.errors.country}
                >
                    <select
                        name="country"
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
                    error={state.errors.city}
                >
                    <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        className={commonInput}
                    />
                </FormGroup>
                <br/>
                <FormGroup
                    title="Gender"
                    error={state.errors.gender}
                >
                    <select
                        name="gender"
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
                    title="Status"
                    error={state.errors.status}
                >
                    <select
                        name="status"
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
                <button type="submit" disabled={isPending || Object.keys(state.errors).length > 0}
                        className="max-w-[50%] mx-auto my-0 text-orange-400 bg-white border border-orange-400 rounded-md px-4 py-2 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-300">
                    Submit
                </button>

            </form>
        </div>
    );
};
export default UserForm;