import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useCallback, useState } from "react";

type ApiState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export function useApi<TResponse>() {
  const [state, setState] = useState<ApiState<TResponse>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = useCallback(
    async (config: AxiosRequestConfig): Promise<TResponse | null> => {
      setState({ data: null, error: null, loading: true });

      try {
        const { data } = await axios<TResponse>(config);

        setState({
          data,
          error: null,
          loading: false,
        });

        return data;
      } catch (err: unknown) {
        const error = err as AxiosError<ApiErrorResponse>;

        const message =
          error.response?.data?.error ??
          error.response?.data?.message ??
          error.message ??
          "Something went wrong";

        setState({
          data: null,
          error: message,
          loading: false,
        });

        return null; // ✅ explicit, safe, predictable
      }
    },
    []
  );

  return {
    request,
    data: state.data,
    error: state.error,
    loading: state.loading,
  };
}
