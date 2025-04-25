// action.ts
"use server"

import {IResponse} from './UserForm';
import {Data} from './UserForm';
import {SortingState} from './DataTable';

interface ValidationRule {
    value: any;
    message: string;
}

interface ValidationRules {
    required?: ValidationRule;
    minLength?: ValidationRule;
    maxLength?: ValidationRule;
    pattern?: {
        value: RegExp;
        message: string;
    };
}

const validationRules: Record<keyof Data, ValidationRules> = {
    id: {},
    name: {
        required: { value: true, message: "Name is required" },
        minLength: { value: 2, message: "Name should be at least 2 symbols" },
        maxLength: { value: 50, message: "Name cannot exceed 50 symbols" },
        pattern: {
            value: /^[a-zA-Zа-яА-Я\s'-]+$/,
            message: "Name can only contain letters and spaces"
        },
    },
    email: {
        required: { value: true, message: "Email is required" },
        minLength: { value: 5, message: "Email should be at least 5 symbols" },
        maxLength: { value: 100, message: "Email cannot exceed 100 symbols" },
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email format"
        },
    },
    country: {
        required: { value: true, message: "Country is required" },
    },
    city: {
        required: { value: true, message: "Email is required" },
        minLength: { value: 5, message: "City should be at least 5 symbols" },
        maxLength: { value: 50, message: "City cannot exceed 100 symbols" },
    },
    gender: {
        required: {value: true, message: "Gender is required"},
    },
    status: {   required: {value: true, message: "Status is required"}, }
};

const isValidFormData = (formData: { [key: string]: string }): Record<keyof Data, string> => {
    return (Object.keys(formData) as Array<keyof Data>).reduce((errors, field) => {

        const value: string = formData[field]?.trim() || '';
        const rules: ValidationRules = validationRules[field];

        if (rules?.required?.value && !value) {
            return { ...errors, [field]: rules.required.message };
        }

        if (value) {
            if (rules?.minLength?.value && value.length < rules.minLength.value) {
                return { ...errors, [field]: rules.minLength.message };
            }

            if (rules?.maxLength?.value && value.length > rules.maxLength.value) {
                return { ...errors, [field]: rules.maxLength.message };
            }

            if (rules?.pattern?.value && !rules.pattern.value.test(value)) {
                return { ...errors, [field]: rules.pattern.message };
            }
        }

        return errors;
    }, {} as Record<keyof Data, string>);
};


export const handleSubmit = async (
    prevState: {
        errors: IResponse<FormData>["errors"],
        data: IResponse<FormData>['data'],
        message: IResponse<FormData>['message']
    },
    formData: FormData,
): Promise<IResponse<FormData>> => {

    console.log(prevState);


    const body: { [key: string]: string } = {};
    for (let entry of formData.entries()) {
        console.log(entry);
        body[entry[0]] = entry[1] as string;
    }
    console.log("Body:", body);

    const result: IResponse<FormData> = {
        errors: {},
        message: [],
        data: {} as FormData,
    };

    const validationErrors = isValidFormData(body);

    if (Object.keys(validationErrors).length > 0) {
        result.errors = validationErrors;
        return result;
    }

    try {
        const response = await fetch('http://localhost:80/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('HTTP статус:', response.status);
        console.log('Заголовки:', [...response.headers.entries()]);

        const responseData = await response.json();

        if (response.ok) {

            return {
                ...responseData,
                navigation: {
                    path: '/result',
                    state: responseData.data
                }
            };

        } else {
            console.error('Server error details:', responseData);
            alert(`Server error: ${responseData.message?.[0] || 'Unknown error'}`);
            return {
                data: {} as FormData,
                errors: responseData.errors || {},
                message: responseData.message || ['Error']
            };

        }
    } catch (error) {
        console.error('Error during submission:', error);
        alert(`Request failed: Unknown error`);
        return {
            data: {} as FormData,
            errors: {network: 'Failed to connect'},
            message: ['Network error']
        };
    }
};

export const fetchUsers = async (): Promise<IResponse<Data[]>> => {
    try {
        const response = await fetch('http://localhost:80/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            data: [],
            errors: { network: 'Failed to fetch users' },
            message: ['Error loading users'],
        };
    }
};

export const handleEditSubmit = async (
    prevState: {
        errors: IResponse<Data>["errors"],
        data: IResponse<Data>['data'],
        message: IResponse<Data>['message']
    },
    formData: FormData,
): Promise<IResponse<Data>> => {
    console.log("prevState:", prevState);
    console.log("formData:", formData);

    const userId = prevState.data?.id;
    console.log("userId:", userId);

    const body: { [key: string]: string } = {};

    if (userId) {
        body.id = userId.toString();
    }

    for (let entry of formData.entries()) {
        console.log(entry);
        if (entry[0] !== 'id') {
            body[entry[0]] = entry[1] as string;
        }
    }
    console.log("Body:", body);
    console.log("Body id:", body.id);

    // const result: IResponse<FormData> = {
    //     errors: {},
    //     message: [],
    //     data: {} as FormData,
    // };

    // const validationErrors = isValidFormData(body);
    //
    // if (Object.keys(validationErrors).length > 0) {
    //     result.errors = validationErrors;
    //     return result;
    // }

    try {
        const response = await fetch(`http://localhost:80/api/users/update/${body.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(body),
            body: JSON.stringify({
                ...body,
                id: parseInt(body.id, 10)
            })
        });

        console.log('HTTP статус:', response.status);
        console.log('Заголовки:', [...response.headers.entries()]);

        const responseData = await response.json();

        if (response.ok) {

            return {
                ...responseData,
                status: response.status,
                navigation: {
                    path: '/result',
                    state: responseData.data
                }
            };

        } else {
            console.error('Server error details:', responseData);
            alert(`Server error: ${responseData.message?.[0] || 'Unknown error'}`);
            return {
                data: {} as Data,
                errors: responseData.errors || {},
                message: responseData.message || ['Error']
            };

        }
    } catch (error) {
        console.error('Error during submission:', error);
        alert(`Request failed: Unknown error`);
        return {
            data: {} as Data,
            errors: {network: 'Failed to connect'},
            message: ['Network error']
        };
    }
};

export const fetchData = async (sortParams: SortingState, onDataFetched: (data: any) => void) => {  //move to actions
    const response = await fetch(
        `http://localhost:80/api/users?_sort=${sortParams.column}&_order=${sortParams.order}`
    );
    const result = await response.json();
    onDataFetched(result.data || []);
};


export const handleDelete = (userId: number, onDelete: (userId: number) => void) => {       //move to actions
    fetch(`http://localhost:80/api/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(res => res.json())
        .then(() => {
            onDelete(userId);
        })
        .catch(error => console.error('Error deleting user:', error));
};

export const deleteSelectedUsers = (selectedUsers: Set<number>, onDelete: (userId: number) => void) => {                     //move to actions
    const selectedUserIds = Array.from(selectedUsers);

    if (selectedUserIds.length === 0) {
        alert('No users selected for deletion');
        return;
    }

    fetch('http://localhost:80/api/users/delete', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUserIds })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(response => {
            if (response.errors && Object.keys(response.errors).length > 0) {
                console.error('Error deleting users:', response.errors);
            } else {
                selectedUserIds.forEach(userId => onDelete(userId));
            }
        })
        .catch(error => {
            console.error('Error deleting users:', error);
        });
};



// export const handleModalSubmit = async (formData: Data): Promise<IResponse<Data>> => {
//     try {
//         const response = await fetch(`http://localhost:80/api/users/update/${formData.id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });
//
//         const data = await response.json();
//
//         if (!response.ok) {
//             return {
//                 data: formData,
//                 errors: data.errors || { server: 'Update failed' },
//                 message: data.message || ['Update error'],
//             };
//         }
//
//         return {
//             data: data.data,
//             errors: {},
//             message: data.message || ['Update successful'],
//         };
//
//     } catch (error) {
//         return {
//             data: formData,
//             errors: { network: 'Connection error' },
//             message: ['Network error'],
//         };
//     }
// };