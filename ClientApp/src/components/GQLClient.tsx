import React, { useEffect } from "react";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { checkCookie, getCookie } from "..";
import { useLogin } from "./Auth";

export default function GQLClient(props: React.PropsWithChildren<{ uri: string }>) {
    const { login } = useLogin();

    const client = createClient({
        url: props.uri + "/graphql",
        requestPolicy: "cache-and-network",
        exchanges: [dedupExchange, cacheExchange({}), fetchExchange]
    });

    if (checkCookie("login")) {
        client.fetchOptions = { headers: { "Authorization": "JWT " + getCookie("login") } };
    }

    useEffect(() => {
        if (login)
            client.fetchOptions = { headers: { "Authorization": "JWT " + getCookie("login") } };
    }, [login]);

    return (<Provider value={client}>
        {props.children}
    </Provider>)
}