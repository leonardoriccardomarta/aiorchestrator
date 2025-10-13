import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public errors?: unknown[]
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown) => {
  console.error('API Error:', error);

  if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
    store.dispatch(logout());
    store.dispatch(
      addNotification({
        type: 'error',
        message: 'Your session has expired. Please log in again.',
      })
    );
    return;
  }

  let message = 'An unexpected error occurred. Please try again later.';

  if (error instanceof APIError) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    message = String(error.data.message);
  } else if (error instanceof Error) {
    message = error.message;
  }

  store.dispatch(
    addNotification({
      type: 'error',
      message,
    })
  );
};

export const formatAPIResponse = <T>(data: unknown): T => {
  if (!data) {
    throw new APIError('No data received from the server');
  }

  if (data && typeof data === 'object' && 'error' in data && data.error) {
    const errorData = data.error as { message?: string; status?: number; code?: string; errors?: unknown[] };
    throw new APIError(
      errorData.message || 'An error occurred',
      errorData.status,
      errorData.code,
      errorData.errors
    );
  }

  return data as T;
};

export const createQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

export const parseQueryString = <T extends Record<string, unknown>>(
  queryString: string
): Partial<T> => {
  const searchParams = new URLSearchParams(queryString);
  const result: Record<string, unknown> = {};

  searchParams.forEach((value, key) => {
    try {
      result[key] = JSON.parse(value);
    } catch {
      result[key] = value;
    }
  });

  return result as Partial<T>;
};

export const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    handleAPIError(error);
  }
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Default export for backward compatibility
const api = {
  handleAPIError,
  formatAPIResponse,
  createQueryString,
  parseQueryString,
  downloadFile,
  formatBytes,
};

export default api; 