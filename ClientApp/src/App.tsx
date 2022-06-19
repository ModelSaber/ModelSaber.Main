import React, { Component, lazy, useEffect } from "react";
import { Route, Routes } from "react-router";
import { Tooltip } from "bootstrap/dist/js/bootstrap.bundle.min";
import Layout from "./components/Layout";
import XRegExp from "xregexp";
import ModelUpload from "./pages/ModelUpload";
const Developer = lazy(() => import("./pages/Developers"));
const Contributions = lazy(() => import("./pages/Contributions"));
const Home = lazy(() => import("./pages/Home"));
const Model = lazy(() => import("./pages/Model"));
const Models = lazy(() => import("./pages/Models"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Logout"));

export const unicodeWord = XRegExp.tag()`^\p{Letter}[\p{Letter}\p{Mark}]*$`;

export default function App() {


    useEffect(() => {
        setTimeout(() => {
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (tooltipTriggerEl) {
                new Tooltip(tooltipTriggerEl);
            });
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
                <Route path="/upload" element={<ModelUpload />} />
            </Routes>
        </Layout>
    );
}

