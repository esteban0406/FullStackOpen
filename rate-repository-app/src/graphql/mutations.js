import { gql } from '@apollo/client'

export const createUser = gql`
  mutation createUser($username: String!, $password: String!) {
    createUser(user: { username: $username, password: $password }) {
      id
      username
    }
  }
`

export const authenticate = gql`
  mutation authenticate($username: String!, $password: String!) {
    authenticate(credentials: { username: $username, password: $password }) {
      accessToken
    }
  }
`


