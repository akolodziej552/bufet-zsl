import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const ADMIN = {
    id: "admin",
    email: "admin@admin.com",
    password: "admin123",
    role: "admin"
};

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const adminExists = users.find((u) => u.role === "admin");
        if (!adminExists) {
            localStorage.setItem("users", JSON.stringify([...users, ADMIN]));
        }
        const savedUser = JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));
        if (savedUser) {
            setUser(savedUser);
        };
        setLoading(false);
    }, []);

    const login = (email, password, remember = false) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const foundUser = users.find(
            (u) => u.email === email && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            if (remember) {
                localStorage.setItem("currentUser", JSON.stringify(foundUser));
            } else {
                sessionStorage.setItem("currentUser", JSON.stringify(foundUser));
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        localStorage.removeItem("cart");
    };

    const updateUser = (changes) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updated = users.map((u) => String(u.id) === String(user.id) ? { ...u, ...changes } : u);
        localStorage.setItem("users", JSON.stringify(updated));
        const newUser = { ...user, ...changes };
        setUser(newUser);
        if (localStorage.getItem("currentUser")) {
            localStorage.setItem("currentUser", JSON.stringify(newUser));
        } else {
            sessionStorage.setItem("currentUser", JSON.stringify(newUser));
    }
    };

    const deleteAccount = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const filtered = users.filter((u) => String(u.id) !== String(user.id));
        localStorage.setItem("users", JSON.stringify(filtered));
        logout();
    }
    return (
        <AuthContext.Provider value={{user, login, logout, updateUser, deleteAccount, loading}}>
            {children}
        </AuthContext.Provider>
    );
}
