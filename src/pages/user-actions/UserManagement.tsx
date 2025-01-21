import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styles.scss'

interface User {
	id: number
	username: string
	password: string
	role: string
}

const mockUsers: User[] = [
	{ id: 1, username: 'admin', password: 'admin', role: 'admin' },
	{ id: 2, username: 'user1', password: 'admin', role: 'user' },
	{ id: 3, username: 'user2', password: 'admin', role: 'user' }
]

const roles = ['user', 'admin']

const UserManagement = () => {
	const [users, setUsers] = useState<User[]>(mockUsers)
	const navigate = useNavigate()

	// const handleRoleChange = (userId: number, newRole: string) => {
	// 	setUsers(
	// 		users.map((user) =>
	// 			user.id === userId ? { ...user, role: newRole } : user
	// 		)
	// 	)
	// }

	const handleEdit = (userId: number) => {
		navigate('edit')
	}

	return (
		<div className='user-management-page'>
			<div className='container'>
				<nav>
					<Link to='/register'>Register New User</Link>
				</nav>

				<h1>User Management</h1>

				<table>
					<thead>
						<tr>
							<th style={{ width: '30px' }}>ID</th>
							<th style={{ width: '100px' }}>Username</th>
							<th style={{ width: '100px' }}>Role</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{user.username}</td>
								<td>{user.role}</td>
								<td>
									<button onClick={() => handleEdit(user.id)}>Edit</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default UserManagement
