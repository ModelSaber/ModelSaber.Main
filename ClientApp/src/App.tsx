import React, { Component } from "react";
import { Route } from "react-router";
import { EventEmitter } from "events";
import Layout from "./Layout";
import Home from "./Home";
import "bootstrap/dist/css/bootstrap.css"; //this will be later moved to scss file but for now its here so i can debug stuff before i start with custom scss files

export default class App extends Component {
    render() {
        return (
            <Layout>
                <Route exact path="/" component={Home} />
            </Layout>
        )
    }
}