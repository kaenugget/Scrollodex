export declare function useAuth(): {
    user: any;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signUp: (email: string, displayName: string, password: string, firstName?: string, lastName?: string, selfieFileId?: string) => Promise<any>;
    signIn: (email: string, password: string) => Promise<any>;
    signInWithGoogle: (googleId: string, email: string, displayName: string, avatarUrl?: string) => Promise<any>;
    signOut: () => Promise<void>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<any>;
    removeAccount: (password: string) => Promise<void>;
};
//# sourceMappingURL=useAuth.d.ts.map