import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetModelsQuery } from "../graphqlTypes";
import { Loader } from "../components/Loader";
import { ModelCard } from "../components/model/ModelCard";
import ModelFilter from "../components/model/ModelFilter";

export default function Models() {
    const [size, setSize] = useState(10);
    const [cursor, setCursor] = useState("");
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);
    const [{ data, fetching }] = useGetModelsQuery({ variables: { first: size, after: cursor, nameFilter: "" } });
    const location = useLocation();
    const history = useNavigate();

    location.hash = `p${page}s${size}`;

    if (fetching) return (<Loader></Loader>);

    return (<>
        <ModelFilter
            filter={filter}
            page={page + 1}
            size={size}
            pageMove={(page, cursor) => { setPage(page); setCursor(cursor); }}
            setSize={setSize}
            setFilter={setFilter} />
        <div className="d-flex flex-wrap justify-content-between" style={{ margin: "0 -30px" }}>
            {data.models.items.map(model => (<ModelCard key={model.id} {...model} navigate={history} />))}
        </div>
        <ModelFilter
            filter={filter}
            page={page + 1}
            size={size}
            pageMove={(page, cursor) => { setPage(page); setCursor(cursor); }}
            setSize={setSize}
            setFilter={setFilter} />
    </>);
}