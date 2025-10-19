import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    console.log('useAuth: Loading token from localStorage:', savedToken ? 'Token found' : 'No token');
    setToken(savedToken);
    setIsLoading(false);
  }, []);

  // Get current user
  const currentUser = useQuery(api.auth.getCurrentUser, 
    token ? { token } : "skip"
  );

  // Debug logging
  useEffect(() => {
    console.log('useAuth: currentUser changed:', currentUser ? 'User found' : 'No user', currentUser?._id);
    
    // Store avatar URL in session storage if user has one and it's not already stored
    if (currentUser?.avatarUrl && !sessionStorage.getItem('userAvatarUrl')) {
      sessionStorage.setItem('userAvatarUrl', currentUser.avatarUrl);
      console.log('Avatar URL stored in session storage from user data:', currentUser.avatarUrl);
    }
  }, [currentUser]);

  // Mutations
  const register = useMutation(api.auth.register);
  const login = useMutation(api.auth.login);
  const googleSignIn = useMutation(api.auth.googleSignIn);
  const logout = useMutation(api.auth.logout);
  const changePassword = useMutation(api.auth.changePassword);
  const deleteAccount = useMutation(api.auth.deleteAccount);

  // Auth actions
  const signUp = async (email: string, displayName: string, password: string, firstName?: string, lastName?: string, selfieFileId?: Id<"_storage">, avatarUrl?: string, avatarFileId?: Id<"_storage">) => {
    try {
      const result = await register({ email, displayName, password, firstName, lastName, selfieFileId, avatarUrl, avatarFileId });
      setToken(result.token);
      localStorage.setItem("authToken", result.token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await login({ email, password });
      setToken(result.token);
      localStorage.setItem("authToken", result.token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async (googleId: string, email: string, displayName: string, avatarUrl?: string) => {
    try {
      const result = await googleSignIn({ googleId, email, displayName, avatarUrl });
      setToken(result.token);
      localStorage.setItem("authToken", result.token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (token) {
        await logout({ token });
      }
      setToken(null);
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if server call fails
      setToken(null);
      localStorage.removeItem("authToken");
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error("Not authenticated");
    return await changePassword({ token, currentPassword, newPassword });
  };

  const removeAccount = async (password: string) => {
    if (!token) throw new Error("Not authenticated");
    await deleteAccount({ token, password });
    setToken(null);
    localStorage.removeItem("authToken");
  };

  // Check if we're still waiting for the user query to resolve
  const isUserLoading = token && currentUser === undefined;
  
  return {
    // State
    user: currentUser,
    token,
    isLoading: isLoading || isUserLoading,
    isAuthenticated: !!currentUser,

    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updatePassword,
    removeAccount,
  };
}
