import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/Login'
import { AuthProvider } from './context/auth/AuthProvider'
import StatisticsPage from './pages/statistics/StatisticsPage'
import RegisterUser from './pages/user-actions/RegisterUser'
import UserManagement from './pages/user-actions/UserManagement'
import EditUser from './pages/user-actions/EditUser'

function App() {
	return (
		<div className='app'>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<StatisticsPage />} />
						<Route path='login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterUser />} />
						<Route path='/users' element={<UserManagement />}>
							<Route path='edit' element={<EditUser />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</div>
	)
}

export default App
