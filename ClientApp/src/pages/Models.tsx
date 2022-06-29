import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Platform, TypeEnum, useGetModelCursorsQuery, useGetModelsQuery } from "../graphqlTypes";
import { Loader } from "../components/Loader";
import { ModelCard } from "../components/model/ModelCard";
import ModelFilter from "../components/model/ModelFilter";

export default function Models() {
    const [size, setSize] = useState(10);
    const [nsfw, setNsfw] = useState(false);
    const [{ data, fetching }] = useGetModelCursorsQuery({ variables: { size: size, nsfw: nsfw } });

    if (fetching) return <Loader />;

    return <ModelsWithCursors cursors={["", ...data.modelCursors]} size={size} nsfw={nsfw} setNsfw={setNsfw} setSize={setSize} />
}

function ModelsWithCursors({ cursors, size, nsfw, setNsfw, setSize }: { cursors: string[], size: number, nsfw: boolean, setNsfw: (nsfw: boolean) => void, setSize: (size: number) => void }) {
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);
    const [platform, setPlatform] = useState(Platform.Pc);
    const [type, setType] = useState<TypeEnum>(undefined);
    const [{ data, fetching }] = useGetModelsQuery({ variables: { first: size, after: cursors[page], modelType: type, platform: platform, nsfw: nsfw } });
    const location = useLocation();
    const history = useNavigate();

    useEffect(() => {
        var hash = location.hash.substring(1);
        if (hash.length > 0) {
            var params = hash.split("&");
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split("=");
                if (param[0] == "s") {
                    setSize(parseInt(param[1]));
                }
                if (param[0] == "f") {
                    setFilter(param[1]);
                }
                if (param[0] == "p") {
                    setPage(parseInt(param[1]));
                }
                if (param[0] == "n") {
                    setNsfw(true);
                }
                if (param[0] == "l") {
                    if (param[1] == "p")
                        setPlatform(Platform.Pc);
                    else if (param[1] == "q")
                        setPlatform(Platform.Quest);
                }
                if (param[0] == "t") {
                    setType(param[1] as TypeEnum);
                }
            }
        }
    }, [true]);

    useEffect(() => {
        var hash = "#s=" + size;
        if (page) {
            hash += "&p=" + page;
        }
        if (filter) {
            hash += "&f=" + filter;
        }
        if (nsfw) {
            hash += "&n";
        }
        if (platform == Platform.Pc) {
            hash += "&l=p";
        }
        else {
            hash += "&l=q";
        }
        if (type) {
            hash += "&t=" + type;
        }
        history(hash);
    }, [size, page, filter, nsfw, platform, type]);

    if (fetching) return (<Loader></Loader>);

    return (<div className="pt-2">
        <ModelFilter
            index={0}
            filter={filter}
            page={page + 1}
            nsfw={nsfw}
            size={size}
            platform={platform}
            type={type}
            cursors={cursors}
            pageMove={page => { setPage(page); }}
            setSize={setSize}
            setFilter={setFilter}
            setNsfw={setNsfw}
            setPlatform={setPlatform}
            setType={setType} />
        <div className="d-flex flex-wrap justify-content-between" style={{ margin: "0 -30px" }}>
            {data.models.items.map(model => (<ModelCard key={model.id} {...model} navigate={history} />))}
        </div>
        <ModelFilter
            index={1}
            filter={filter}
            page={page + 1}
            nsfw={nsfw}
            size={size}
            platform={platform}
            type={type}
            cursors={cursors}
            pageMove={page => { setPage(page); }}
            setSize={setSize}
            setFilter={setFilter}
            setNsfw={setNsfw}
            setPlatform={setPlatform}
            setType={setType} />
    </div>);
}