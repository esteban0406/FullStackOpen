import { StyleSheet, View } from 'react-native'
import RepositoryList from './RepositoryList'
import AppBar from './AppBar'
import { Route, Routes, Navigate } from 'react-router-native'
import SignIn from './SignIn'

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#E1E4E8',
    flexShrink: 1,
  },
})

const Main = () => {
  return (
    <>
      <View style={styles.main}>
        <AppBar />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<RepositoryList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </View>
    </>
  )
}

export default Main
