// client/src/hooks/useApiMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useApiMutation({ method, path, invalidate = [], onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async payload => {
      switch (method.toUpperCase()) {
        case 'POST':
          return api.raw.post(path, payload);
        case 'PUT':
          return api.raw.put(path, payload);
        case 'DELETE':
          return api.raw.delete(path, payload);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    onSuccess: data => {
      if (invalidate.length > 0) {
        invalidate.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      }
      if (onSuccess) onSuccess(data);
    },
    onError: err => {
      console.error('Mutation error:', err);
      if (onError) onError(err);
    }
  });
}
