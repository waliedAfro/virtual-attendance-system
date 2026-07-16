import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserLicenses } from '../../../services/user-license';

export const useSubscriptionLicenses = (subscriptionId) => {
  const queryClient = useQueryClient();

  // Fetch licenses by subscription ID
  const { data: licenses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['subscription-licenses', subscriptionId],
    queryFn: () => UserLicenses.getBySubscription(subscriptionId),
    enabled: !!subscriptionId,
  });

  // Revoke license mutation
  const revokeMutation = useMutation({
    mutationFn: UserLicenses.revoke,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-licenses', subscriptionId] });
    },
  });

  // Assign license mutation (now expects subscriptionId and userId)
  const assignMutation = useMutation({
    mutationFn: (payload) => UserLicenses.assignToSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-licenses', subscriptionId] });
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