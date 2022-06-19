import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../components/Auth";

export default function Logout() {
    const navigate = useNavigate();
    const { login, updateLogin } = useLogin();
    useEffect(() => {
        document.cookie = "login=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        updateLogin();
    });
    useEffect(() => {
        navigate("/");
    }, [login]);
    return (<></>);
}; 