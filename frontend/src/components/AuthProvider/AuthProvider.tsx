import React, { createContext, useContext, useState, useEffect, ReactNode} from 'react'
import { SemanticClassificationFormat } from 'typescript';

/*AuthContextの定義型*/
interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

/*コンテキスト*/
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    /*発動時にトークンを見る*/
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            setIsAuthenticated(true);
        }
    },[]);
    
    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}