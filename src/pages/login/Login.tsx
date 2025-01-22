import React, { useState } from 'react'
import { TextField, Button, Typography } from '@mui/material'
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
				<Typography variant='h4' component='h1' gutterBottom>
					Вход
				</Typography>

				<form onSubmit={handleLogin}>
					<TextField
						label='Имя пользователя'
						variant='outlined'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						error={!!errors.username}
						helperText={errors.username}
						fullWidth
						className='text-field'
					/>

					<TextField
						label='Пароль'
						variant='outlined'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						error={!!errors.password}
						helperText={errors.password}
						fullWidth
						className='text-field'
					/>

					<Button type='submit' variant='contained' color='primary' fullWidth>
						Войти
					</Button>
				</form>
			</div>
		</div>
	)
}
