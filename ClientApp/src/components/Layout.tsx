import React, { Component, PropsWithChildren, useEffect } from "react";
import NavBar from "./NavBar";
import "./Layout.scss";
import { useGetApiVersionQuery } from "../graphqlTypes";

export default function Layout(props: PropsWithChildren<{}>) {
    const [{ mainVersion, mainBuildTime }, setMainVersionAndBuildTime] = React.useState({
        mainVersion: "",
        mainBuildTime: ""
    });
    const [{ data, fetching }] = useGetApiVersionQuery();

    useEffect(() => {
        fetch("api").then(async t => {
            if (!t.ok)
                return;
            var build = await t.json();
            setMainVersionAndBuildTime({ mainBuildTime: new Date(Date.parse(build.buildTime)).toLocaleString(), mainVersion: build.buildVersion });
        }).catch(console.error);
    }, []);

    return (<>
        <NavBar />
        <div className="container">
            {props.children}
        </div>
        <div className="spacer" />
        <footer className="footer bg-dark">
            <div className="container">
                <div className="row">
                    <label className="col-md-4">Website Version: {mainVersion}, Build Time: {mainBuildTime}</label>
                    {!fetching && data && (<label className="col-md-4">API Version: {data.version}, Build Time: {new Date(Date.parse(data.buildTime)).toLocaleString()}</label>)}
                    <div className="col-md-4">
                        <a className="btn btn-primary" href="https://discord.gg/PTnyY3shSQ" target="_blank"><i className="bi bi-discord"></i> Discord</a>
                        <a className="btn btn-primary ms-3" href="https://github.com/ModelSaber/ModelSaber/" target="_blank"><i className="bi bi-github"></i> GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    </>);
}