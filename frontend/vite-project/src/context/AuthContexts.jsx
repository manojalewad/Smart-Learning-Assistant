import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Authcontext = createContext();

export const useAuth = () => {
    const context = useContext(Authcontext);

    if (!context) {
        throw new Error("useAuth must be within Authprovider");
    }

    return context;
};

export const Authprovider = ({ children }) => {
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);
    const [isauthenticated, setisauthenticated] = useState(false);

    useEffect(() => {
        checkauthstatus();
    }, []);

    const checkauthstatus = () => {
        try {
            const token = localStorage.getItem("token");
            const userstr = localStorage.getItem("user");

            if (!token || !userstr) {
                logout(false);
                return;
            }

            // decode token and check expiry
            const decoded = jwtDecode(token);

            // exp is in seconds, Date.now() in milliseconds
            if (decoded.exp * 1000 < Date.now()) {
                logout(false);
                return;
            }

            const userdata = JSON.parse(userstr);

            setuser(userdata);
            setisauthenticated(true);
        } catch (error) {
            console.error("Auth check failed:", error);
            logout(false);
        } finally {
            setloading(false);
        }
    };

    const login = (userdata, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userdata));

        setuser(userdata);
        setisauthenticated(true);
    };

    const logout = (redirect = true) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setuser(null);
        setisauthenticated(false);

        if (redirect) {
            window.location.href = "/login";
        }
    };

    const updateuser = (updateuserdata) => {
        const newuserdata = { ...user, ...updateuserdata };
        localStorage.setItem("user", JSON.stringify(newuserdata));
        setuser(newuserdata);
    };

    const value = {
        user,
        loading,
        isauthenticated,
        login,
        logout,
        updateuser,
        checkauthstatus,
    };

    return (
        <Authcontext.Provider value={value}>
            {children}
        </Authcontext.Provider>
    );
};