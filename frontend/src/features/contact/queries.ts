import { useMutation } from '@tanstack/react-query';
import type { ContactInput } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (input: ContactInput) =>
      (
        await apiRequest<{ submitted: boolean; id: string }>('/contact', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
  });
}
