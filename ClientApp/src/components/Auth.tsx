import React, { createContext, createElement, PropsWithChildren, useContext, useState } from "react";
import { checkCookie, getParamFromLogin } from "..";

const LoginContext = createContext({
    login: false,
    user: {
        uuid: "",
        name: "",
        discordId: ""
    },
    updateLogin: () => { }
});

export function useLogin() {
    return useContext(LoginContext);
}

export default function Auth(params: PropsWithChildren<{}>) {
    const loggedIn = checkCookie("login");
    const user = loggedIn ? {
        uuid: getParamFromLogin("uuid"),
        name: getParamFromLogin("name"),
        discordId: getParamFromLogin("discordId")
    } : { uuid: "", name: "", discordId: "" };
    const [login, setLogin] = useState({ login: loggedIn, user });

    function updateLogin() {
        const loggedIn = checkCookie("login");
        const user = loggedIn ? {
            uuid: getParamFromLogin("uuid"),
            name: getParamFromLogin("name"),
            discordId: getParamFromLogin("discordId")
        } : { uuid: "", name: "", discordId: "" };
        setLogin(
            {
                login: loggedIn,
                user
            }
        );
    }

    return createElement(LoginContext.Provider,
        {
            value: { ...login, updateLogin },
            children: params.children
        });
}