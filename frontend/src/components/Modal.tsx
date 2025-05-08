import FormGroup from "./ui/FormGroup.tsx";
import {Data, IResponse} from './pages/UserForm.tsx';
import {handleEditSubmit} from '../api/action.ts';
import { useUserContext } from '../context/UserContext';
import {useActionState, useEffect} from 'react';

const modalContainer = "fixed z-[1] space-y-2 p-6 mx-auto w-full h-full flex items-center justify-center bg-[Rgba(0,0,0,0.4)] left-0 top-0";
const modal = "bg-[white] w-[25em] flex flex-col gap-3 md:gap-4  p-4 md:p-6 lg:p-8 rounded-[10px]";

const commonInput = "mt-1 block w-full p-2 rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300";
const commonSelect = "mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

interface ModalProps {
    onClose: () => void;
    mode: 'edit' | 'delete';
    onConfirmDelete?: () => void;
    onEdit?: (updatedData: Data) => void;
    userData?: Data | null;
    message?: string;
    dataSource: 'local' | 'gorest';
}

export default function Modal({   onClose,
                                  mode,
                                  onConfirmDelete,
                                  onEdit,
                                  userData,
                                  message,
                                  dataSource
                              }: ModalProps ) {
    const { setUserData } = useUserContext();

    // const [state, formAction, isPending] = useActionState<IResponse<Data>, FormData>(handleEditSubmit, {
    //     errors: {},
    //     message: [],
    //     data: userData ? { ...userData } : {} as Data
    // });

    const [state, formAction, isPending] = useActionState<IResponse<Data>, FormData>(
        (prevState, formData) => handleEditSubmit(prevState, formData, dataSource),
        {
            errors: {},
            message: [],
            data: userData ? { ...userData } : {} as Data,
        }
    );


    useEffect(() => {
        if (state.status === 200) {
            setUserData(state.data);
            if (onEdit) {
                onEdit(state.data);
            }
            onClose();

        }
    }, [state.status]);

    return (
        <div className={modalContainer}>
            <div className={modal}>
                {mode === 'edit' ? (
                    <>
                <h1 className="mb-8 text-black text-xl md:text-2xl font-bold text-center">Edit user information</h1>
                <form
                    action={formAction}
                    className="flex flex-col gap-1.5">
                    <FormGroup
                        title="Full name"
                        error={state.errors.name}
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            className={commonInput}
                            defaultValue={userData?.name}

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
                            defaultValue={userData?.email}
                        />
                    </FormGroup>

                    <div className="grid md:grid-cols-2 gap-2 md:gap-4">
                        <FormGroup
                            title="Country"
                            error={undefined}
                        >
                            <select
                                name="country"
                                className={commonSelect}
                                defaultValue={userData?.country}
                            >
                                <option value="" disabled>
                                    Select your country
                                </option>
                                <option value="usa">USA</option>
                                <option value="poland">Poland</option>
                                <option value="belarus">Belarus</option>
                            </select>
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
                                defaultValue={userData?.city}
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
                                defaultValue={userData?.gender}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </FormGroup>

                        <FormGroup
                            title="Status"
                            error={undefined}
                        >
                            <select
                                name="status"
                                className={commonSelect}
                                // value={formData.status}
                                // onChange={handleChange}
                                defaultValue={userData?.status}
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
                            disabled={isPending || Object.keys(state.errors).length > 0}
                            className="text-orange-400 bg-white border border-orange-400 rounded-md px-4 py-2 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-300">
                            Save changes
                        </button>
                    </div>
                </form>
                    </>
                ) : (
                    <>
                    <h1 className="text-black text-xl md:text-2xl font-bold text-center">Confirm Deletion</h1>
                    <p className=" text-center">{message}</p>
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