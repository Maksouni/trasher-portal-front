import React from "react";

interface UserFormProps {
    onUserRegister: (newUser: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserRegister }) => {
    const [login, setLogin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle user registration logic here
        console.log({ login, password, role });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="login">Login:</label>
                <input
                    type="text"
                    id="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="role">Role:</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>
            <button type="submit">Register User</button>
        </form>
    );
};

export default UserForm;