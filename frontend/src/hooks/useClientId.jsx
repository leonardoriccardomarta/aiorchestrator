import { useAuth } from '../context/AuthContext';

/**
 * Custom hook per recuperare l'ID del tenant/client.
 */
export default function useClientId() {
  const { user } = useAuth();
  return user?.tenant || null;
}
