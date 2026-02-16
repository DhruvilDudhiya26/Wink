import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/authService";
import { registerForPushNotificationsAsync } from "../services/notificationService";
import { connectSocket, disconnectSocket } from "../socket/socket";
import { updateProfile } from "../socket/socketEvents";

export const AuthContext = createContext({
    token: null,
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    register: () => { },
    updateToken: () => { }
});
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        loadToken();
    }, [])
    const router = useRouter();

    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                if (decoded.exp && decoded.exp < Date.now() / 1000) {
                    await AsyncStorage.removeItem("token");
                    goToWelcomePage();
                    return
                }
                setToken(storedToken);
                setUser(decoded.user);
                await connectSocket();
                goToHomePage();
            } catch (error) {
                goToWelcomePage();
            }
        } else {
            goToWelcomePage();
        }
    }
    const goToHomePage = () => {
        setTimeout(() => {
            router.replace("/(main)/home")
        }, 1500)
    }
    const goToWelcomePage = () => {
        setTimeout(() => {
            router.replace("/(auth)/welcome")
        }, 1500)
    }
    const updateToken = async (token) => {
        if (token) {
            setToken(token);
            await AsyncStorage.setItem("token", token);
            await connectSocket();
            // decoded value 
            const decoded = jwtDecode(token);
            setUser(decoded?.user);

            // Register for push notifications
            registerForPushNotificationsAsync().then(token => {
                if (token) {
                    updateProfile({ pushToken: token });
                }
            });
        }
    }
    const login = async (email, password) => {
        const response = await loginRequest(email, password);
        await updateToken(response.token);
        await connectSocket();
        router.replace("../(main)/home")
    }

    // keep signature matching how it's used in Register screen: (name, email, password, avatar)
    const register = async (name, email, password, avatar) => {
        const response = await registerRequest(email, password, name, avatar);
        await updateToken(response.token);
        await connectSocket();
        router.replace("../(main)/home")
    }

    const logout = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        disconnectSocket();
        router.replace("/(auth)/welcome")
    }
    return (
        <AuthContext.Provider value={{ token, user, isLoading, isAuthenticated, updateToken, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)