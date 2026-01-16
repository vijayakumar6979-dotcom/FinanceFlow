import { createContext, useContext } from 'react';
import { useAuth as useSharedAuth } from '@financeflow/shared';

// Infer the return type of the shared hook
type AuthContextType = ReturnType<typeof useSharedAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useSharedAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};
