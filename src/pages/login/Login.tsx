import React, { useState } from 'react'
import './styles.scss'

export default function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<{ [key: string]: string }>({})

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		const newErrors: { [key: string]: string } = {}

		if (!username) newErrors.username = 'Введите имя пользователя'
		if (!password) newErrors.password = 'Введите пароль'

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		// Handle login logic here
	}

	return (
		<div className='login-page'>
			<div className='container'>
				<h1>Вход</h1>

				<form onSubmit={handleLogin}>
					<div>
						<input
							type='text'
							placeholder='Имя пользователя'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className={errors.username ? 'error' : ''}
						/>
						{errors.username && <span>{errors.username}</span>}
					</div>

					<div>
						<input
							type='password'
							placeholder='Пароль'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={errors.password ? 'error' : ''}
						/>
						{errors.password && <span>{errors.password}</span>}
					</div>

					<button type='submit'>Войти</button>
				</form>
			</div>
		</div>
	)
}
