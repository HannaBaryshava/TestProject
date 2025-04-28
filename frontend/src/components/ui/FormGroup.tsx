import React, {PropsWithChildren} from "react";

type Props = {
    title: string;
    error?: string; //затипизировать title, error
} & PropsWithChildren

const FormGroup: React.FC<Props> = ({ title, error, children }) => {
    return (
        <label className="block text-left">
        <span className="text-gray-700 font-medium mb-1 ml-2 block">{title}:</span>
    {children}
    {error && <p className="text-red-500 text-sm ml-2 mt-1">{error}</p>}
        </label>
    );
    };

    export default FormGroup;