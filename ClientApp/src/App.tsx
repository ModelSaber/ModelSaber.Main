import React, { lazy, useEffect } from "react";
import { Route, Routes } from "react-router";
const Layout = lazy(() => import("./components/Layout"));
const Upload = lazy(() => import("./pages/Upload"));
const Developer = lazy(() => import("./pages/Developers"));
const Contributions = lazy(() => import("./pages/Contributions"));
const Home = lazy(() => import("./pages/Home"));
const Model = lazy(() => import("./pages/Model"));
const Models = lazy(() => import("./pages/Models"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Logout"));

export let unicodeWord: RegExp;

import("xregexp").then((xregexp) => {
    unicodeWord = xregexp.default.tag()`^\p{Letter}[\p{Letter}\p{Mark}]*$`;
});

export default function App() {
    useEffect(() => {
        setTimeout(() => {
            import("bootstrap/dist/js/bootstrap.bundle.min").then(({ Tooltip }) => {
                document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (tooltipTriggerEl) {
                    new Tooltip(tooltipTriggerEl);
                });
            })
        }, 500);
    });

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/models" element={<Models />} />
                <Route path="/contributions" element={<Contributions />} />
                <Route path="/dev" element={<Developer />} />
                <Route path="/discordlogin" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/model/:id" element={<Model />} />
                <Route path="/upload" element={<Upload />} />
            </Routes>
        </Layout>
    );
}

