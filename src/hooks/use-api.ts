import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { queryClient } from "../lib/api-client";

export const useApiQuery = <T>(
	keys: string[],
	fn: (...args: any) => Promise<T>,
	params?: { [key: string]: string },
) => {
	return useQuery({
		queryKey: keys,
		queryFn: ({ signal }) => fn({ ...params, signal }),
		select: (data) => data,
	});
};

export const useApiMutation = <T>(
	keys: string[],
	fn: (...args: any) => Promise<T>,
	invalidateKeys: string[],
	onSuccess?: (data: T) => void,
) => {
	return useMutation({
		mutationKey: keys,
		mutationFn: fn,
		onError: (error) => {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.error || "Something went wrong!");
			}
		},
		onSuccess: (data) => {
			onSuccess && onSuccess(data);

			invalidateKeys.length > 0 &&
				invalidateKeys.forEach((key) => {
					queryClient.invalidateQueries({
						queryKey: [key],
					});
				});
		},
	});
};
