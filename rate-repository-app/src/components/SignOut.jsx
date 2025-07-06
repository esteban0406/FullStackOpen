import { useNavigate } from 'react-router-native'
import { Button } from 'react-native'
import useSignOut from '../hooks/useSignOut'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

const SignOut = () => {
  const navigate = useNavigate()
  const signOut = useSignOut()
  const { logout } = useContext(AuthContext)

  const handleSignOut = async () => {
    try {
      await signOut()
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return <Button title="Cerrar sesión" onPress={handleSignOut} />
}

export default SignOut