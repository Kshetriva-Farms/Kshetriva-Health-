import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout } =
    useAuthContext();

  return {
    user,
    isAuthenticated: !!user,
    loading,
    subscriptionTier: user?.subscriptionTier || 'NONE',
    isVIP: user?.subscriptionTier === 'VIP_HEALTH_PLUS',
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  };
}
