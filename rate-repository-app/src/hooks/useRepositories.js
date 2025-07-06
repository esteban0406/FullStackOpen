import { useQuery } from '@apollo/client';

import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = () => {
  const { data, loading, error, refetch } = useQuery(GET_REPOSITORIES);
  
  return {
    repositories: data ? data.repositories : undefined,
    loading,
    error,
    refetch,
  };
};

export default useRepositories;
