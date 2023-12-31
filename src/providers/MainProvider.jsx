import { axios } from 'api/axios'
import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const MainContextInitialValue = {
	user: {},
	setUser: () => {},
}

export const MainContext = createContext(MainContextInitialValue)

export const MainProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [courses, setCourses] = useState([])
	const [tests, setTests] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const token = Cookies.get('token')

		const refreshUser = async () => {
			try {
				const data = await axios.get('auth/refresh', {
					headers: {
						token: token ? JSON.parse(token) : null,
					},
				})
				setUser(data.data)
			} catch (error) {
				console.log(error)
			} finally {
				setIsLoading(false)
			}
		}

		refreshUser()
	}, [])

	useEffect(() => {
		const getCourses = async () => {
			try {
				const data = await axios.get('course/find')
				setCourses(data.data)
			} catch (error) {
				console.log(error)
			}
		}

		const getTests = async () => {
			try {
				const data = await axios.get('test/find')
				setTests(data.data)
			} catch (error) {
				console.log(error)
			}
		}
		getCourses()
		getTests()
	}, [])

	return (
		<MainContext.Provider
			value={{
				user,
				setUser,
				isLoading,
				courses,
				tests,
			}}
		>
			{children}
		</MainContext.Provider>
	)
}
