import AsyncStorage from '@react-native-async-storage/async-storage'

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace
  }

  async getAccessToken() {
    const getToken = await AsyncStorage.getItem(`${this.namespace}:accessToken`)
    return getToken ? JSON.parse(getToken) : null
  }

  async setAccessToken(accessToken) {
    const setToken = await this.getAccessToken()
    if (!setToken) {
      return AsyncStorage.setItem(
        `${this.namespace}:accessToken`,
        JSON.stringify(accessToken)
      ).catch((error) => {
        console.error('Error setting access token:', error)
      })
    }
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(`${this.namespace}:accessToken`)

    return AsyncStorage.removeItem(`${this.namespace}:accessToken`).catch(
      (error) => {
        console.error('Error removing access token:', error)
      }
    )
  }
}

export default AuthStorage
