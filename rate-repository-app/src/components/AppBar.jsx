import { View, StyleSheet } from 'react-native'
import theme from '../theme'
import Text from './Text'
import { Link } from 'react-router-native'
import Constants from 'expo-constants'
import SignOut from './SignOut'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.textPrimary,
    color: 'white',
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

const AppBar = () => {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <Link to={'/'}>
        <Text style={styles.container}>Repositories</Text>
      </Link>
      {isLoggedIn ? (
        <SignOut />
      ) : (
        <Link to={'/signin'}>
          <Text style={styles.container}>Sign In</Text>
        </Link>
      )}
    </View>
  )
}

export default AppBar
