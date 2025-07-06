import { NativeRouter } from 'react-router-native'
import { ApolloProvider } from '@apollo/client'

import Main from './src/components/Main'
import createApolloClient from './src/utils/apolloClient'
import AuthStorage from './src/utils/authStorage'

import AuthStorageContext from './src/contexts/AuthStorageContext'

import AuthProvider from './src/utils/AuthProvider'

const authStorage = new AuthStorage()
const apolloClient = createApolloClient(authStorage)

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <AuthStorageContext.Provider value={authStorage}>
           <AuthProvider>
            <Main />
          </AuthProvider>
        </AuthStorageContext.Provider>
      </ApolloProvider>
    </NativeRouter>
  )
}

export default App
