import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'

const RegisterUser = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('')
	const [message, setMessage] = useState('')
	const [errors, setErrors] = useState<{ [key: string]: string }>({})

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		const newErrors: { [key: string]: string } = {}

		if (!username) newErrors.username = 'Username is required'
		if (!password) newErrors.password = 'Password is required'
		if (!role) newErrors.role = 'Role is required'

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		setMessage('User registered successfully')
		setErrors({})
	}

	return (
		<div className='register-page'>
			<div className='container'>
				<nav>
					<Link to='/users'>User List</Link>
				</nav>

				<form onSubmit={handleRegister}>
					<h1>Register User</h1>
					<div>
						<input
							type='text'
							placeholder='Username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className={errors.username ? 'error' : ''}
						/>
						{errors.username && <span>{errors.username}</span>}
					</div>

					<div>
						<input
							type='password'
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={errors.password ? 'error' : ''}
						/>
						{errors.password && <span>{errors.password}</span>}
					</div>

					<div>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className={errors.role ? 'error' : ''}
						>
							<option value=''>Select Role</option>
							<option value='user'>User</option>
							<option value='admin'>Admin</option>
						</select>
						{errors.role && <span>{errors.role}</span>}
					</div>

					<button type='submit'>Register</button>
				</form>
				{message && <p>{message}</p>}
			</div>
		</div>
	)
}

export default RegisterUser
