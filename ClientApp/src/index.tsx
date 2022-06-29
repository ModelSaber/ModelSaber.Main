import React, { Component, lazy, Suspense } from "react";
import "./index.scss";
import "bootstrap-icons/font/bootstrap-icons.scss";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./serviceWorker";
import { Loader } from "./components/Loader";
const Auth = lazy(() => import("./components/Auth"));
const GQLClient = lazy(() => import("./components/GQLClient"));
const App = lazy(() => import("./App"));

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");
const loaderbackground = document.getElementById("lds-roller");
const uri = process.env.DEV ? process.env.REACT_APP_API_URL : "https://apimodelsaber.rainemods.io";
export const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

class Index extends Component {
    componentDidMount() {
        if (window.location.pathname !== "/login") {
            rootElement.classList.remove("loading-hidden");
            loaderbackground.classList.add("loading-hidden");
            setTimeout(() => {
                loaderbackground.classList.add("loading-inactive");
            }, 1000);
        }
    }

    render() {
        return (
            <React.StrictMode>
                <Suspense fallback={<Loader />}>
                    <BrowserRouter basename={baseUrl}>
                        <Auth>
                            <GQLClient uri={uri}>
                                <App />
                            </GQLClient>
                        </Auth>
                    </BrowserRouter>
                </Suspense>
            </React.StrictMode>
        );
    }
}

import('react-dom').then(ReactDOM => {
    ReactDOM.render(<Index />, rootElement);
});


registerServiceWorker();

export function getCookie(cname: string) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function checkCookie(cname: string) {
    return !!getCookie(cname);
}

export function b64DecodeUnicode(str: string) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

export function decodeLogin() {
    var str = getCookie("login").split(".");
    return JSON.parse(b64DecodeUnicode(str[1]));
}

export function getParamFromLogin(param: string) {
    return decodeLogin()[param];
}