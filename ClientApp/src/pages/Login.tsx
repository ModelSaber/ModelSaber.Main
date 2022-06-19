import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { unicodeWord } from "../App";
import { useLogin } from "../components/Auth";

export default function DiscordRedirLogin() {
    // const [requireName, setRequireName] = useState(false);
    const { login, updateLogin } = useLogin();
    const [discordObj, setDiscordObj] = useState({ discordId: "", email: "", name: "", avatar: "" });
    const navigate = useNavigate();

    const search = window.location.hash.substr(1).split('&').map(t => t.split('=')).reduce((map: { [key: string]: string }, obj) => { map[obj[0]] = obj[1]; return map }, {});
    if (search["error"] !== undefined) {
        // window.close();
    }
    else {
        fetch("https://discord.com/api/v6/users/@me", {
            headers: {
                "Authorization": "Bearer " + search["access_token"]
            }
        }).then(res => {
            if (res.ok)
                return res.json();
            else
                return Promise.reject();
        }).then(async res => {
            var body = { discordId: res.id, email: res.email, name: res.username, avatar: res.avatar };
            console.log(body);
            var check = await (await fetch("api/user?discordId=" + body.discordId)).text() === "true";
            if (unicodeWord.test(body.name) || check) {
                if (check) {
                    await loginUser(body);
                }
                else {
                    await createUser(body);
                }
            }
            else {
                // setRequireName(true);
                setDiscordObj(body);
            }
        });
    }

    async function createUser(obj: { discordId: string, email: string, name: string, avatar: string }) {
        var body = Object.assign(discordObj, obj);
        await fetch("api/user", { body: JSON.stringify(body), method: "POST", headers: { "Content-Type": "application/json" } });
        loginUser(body);
    }

    async function loginUser(obj: { discordId: string, email: string, name: string, avatar: string }) {
        await fetch("api/login", { body: JSON.stringify(obj), method: "POST", headers: { "Content-Type": "application/json" } });
        updateLogin();
    }
    useEffect(() => {
        navigate("/");
    }, [login]);
    return (<></>);
};