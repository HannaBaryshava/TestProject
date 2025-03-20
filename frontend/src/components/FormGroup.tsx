
const FormGroup = ({ title, error, children }) => {
    return (
        <label className="block text-left mb-4">
        <span className="text-gray-700 font-medium mb-1 block">{title}:</span>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </label>
    );
    };

    export default FormGroup;