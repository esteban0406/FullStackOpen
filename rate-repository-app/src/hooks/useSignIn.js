import {qgl, useMutation} from '@apollo/client';

import {authenticate} from '../graphql/mutations';

const useSignIn = () => {
  const [mutate, result] = useMutation(authenticate);

  const signIn = async ({ username, password }) => {
    const response = await mutate({
      variables: { username, password },
    });
    return response;
  };

  return [signIn, result];
};

export default useSignIn;