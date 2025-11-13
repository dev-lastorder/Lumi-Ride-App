import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRiderPassword, updateRiderProfile } from "../../services";
import { UpdateRiderProfile, updateRiderProfileParams } from "../../types";

export const useUpdateRiderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateRiderProfile, Error, updateRiderProfileParams>({
    mutationFn: updateRiderProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateRiderPassword = () => {
  return useMutation({
    mutationFn: (params: { currentPassword: string; newPassword: string }) =>
      updateRiderPassword(params),
  });
};
