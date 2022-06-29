import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1 className="align-middle">
                Welcome to ModelSaber <label style={{ display: "inline", fontSize: 1, textDecorationLine: "line-through", opacity: 0.1 }}><i>(Destroyer of old links)</i></label>
            </h1>
            <a onClick={() => navigate("/models")} className="btn btn-primary">Models</a>
        </div>
    );
};
