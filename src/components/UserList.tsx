import React from 'react';

const UserList = () => {
    const [users, setUsers] = React.useState<{ id: string | number; login: string; role: string }[]>([]);

    const fetchUsers = async () => {
        // Fetch users from an API or a local source
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    };

    const handleRoleChange = async (userId: string | number, newRole: string) => {
        // Update user role via an API call
        await fetch(`/api/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: newRole }),
        });
        fetchUsers(); // Refresh the user list
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.login} - {user.role}
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="guest">Guest</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;