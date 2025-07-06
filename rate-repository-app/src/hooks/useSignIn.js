import { useMutation } from '@apollo/client'
import { authenticate } from '../graphql/mutations'
import useAuthStorage from './useAuthStorage';
import { useApolloClient } from '@apollo/client'

const useSignIn = () => {
  const [mutate, result] = useMutation(authenticate)
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    const response = await mutate({
      variables: { username, password },
    })
    if (response.data) {
      const { accessToken } = response.data.authenticate
      if (accessToken) {
        await authStorage.setAccessToken(accessToken)
        apolloClient.resetStore();
      } else {
        throw new Error('Authentication failed: No token received')
      }
    }
    return response
  }

  return [signIn, result]
}

export default useSignIn
