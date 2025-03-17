// import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useActionState from './useActionState';

const UserForm = () => {
    const navigate = useNavigate();
    const {
        formData,
        handleChange,
        handleSubmit,
        errors,
        isSubmitting,
    } = useActionState();

    console.log('Current errors:', errors);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e);
        if (!isSubmitting && Object.keys(errors).length === 0) {
            navigate('/result', { state: formData });
        }
    };

    const commonInputClasses = "mt-1 block w-full rounded-md border-gray-700 shadow-sm hover:border-transparent text-gray-700 hover:bg-orange-100 focus:outline-none transition duration-300";
    const commonClasses = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:border-transparent hover:bg-orange-100 focus:outline-none transition duration-300";

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-2">
            <h1 className="mb-8 text-black text-2xl font-bold text-center">Create new user</h1>
            <form onSubmit={onSubmit} className="space-y-1">
                <label className="block text-left">
                    <span className="text-gray-700">Your first and last name:</span>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        // required
                        placeholder="Enter first and last name"
                        className={commonInputClasses}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </label>
                <br/>
                <label className="block text-left">
                     <span className="text-gray-700">Email:</span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enetr email"
                        className={commonInputClasses}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </label>
                <br/>
                <label className="block text-left">
                     <span className="text-gray-700">Country of residence:</span>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className={commonClasses}
                    >
                        <option value="" disabled>
                            Select your country
                        </option>
                        <option value="usa">USA</option>
                        <option value="poland">Poland</option>
                        <option value="belarus">Belarus</option>
                    </select>
                    {errors.country && <p style={{color: 'red'}}>{errors.country}</p>}
                </label>
                <br/>
                <label className="block text-left">
                    <span className="text-gray-700">City:</span>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Enter city"
                        className={commonInputClasses}
                    />
                    {errors.city && <p style={{color: 'red'}}>{errors.city}</p>}
                </label>
                <br/>

                    <label className="block text-left">
                        <span className="text-gray-700">Gender:</span>

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className={commonClasses}
                    >
                        <option value="" disabled>
                            Select your gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.gender && <p style={{color: 'red'}}>{errors.gender}</p>}
                </label>
                <br/>
                <label className="block text-left">
                    <span className="text-gray-700">Status:</span>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className={commonClasses}
                    >
                        <option value="" disabled>
                            Select your status
                        </option>
                        <option value="active">Active user</option>
                        <option value="inactive">Inactive user</option>
                    </select>
                    {errors.status && <p style={{color: 'red'}}>{errors.status}</p>}
                </label>
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