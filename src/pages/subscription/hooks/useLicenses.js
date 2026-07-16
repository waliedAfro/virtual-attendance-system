import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserLicenses } from '../../../services/user-license'; 

export const useLicenses = (userId) => {
  const queryClient = useQueryClient();

  // Fetch licenses
  const { data: licenses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['licenses', userId],
    queryFn: () => UserLicenses.getByUser(userId),
    enabled: !!userId,
  });

  // Revoke license mutation
  const revokeMutation = useMutation({
   mutationFn: UserLicenses.revoke,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses', userId] });
    },
  });

  // Assign license mutation
  const assignMutation = useMutation({
    mutationFn: UserLicenses.assign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses', userId] });
    },
  });

  return {
    licenses,
    isLoading,
    error,
    refetch,
    revokeLicense: revokeMutation.mutate,
    assignLicense: assignMutation.mutate,
    isRevoking: revokeMutation.isPending,
    isAssigning: assignMutation.isPending,
  };
};