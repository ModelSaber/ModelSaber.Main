import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Platform, TypeEnum, useGetModelCursorsQuery, useGetModelsQuery } from "../graphqlTypes";
import { Loader } from "../components/Loader";
import { ModelCard } from "../components/model/ModelCard";
import ModelFilter from "../components/model/ModelFilter";

export default function Models() {
    const [size, setSize] = useState(10);
    const [nsfw, setNsfw] = useState(false);
    const [platform, setPlatform] = useState(Platform.Pc);
    const [type, setType] = useState<TypeEnum>(undefined);
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);
    const [{ data, fetching }] = useGetModelCursorsQuery({ variables: { size: size, nsfw: nsfw, platform: platform, type: type } });

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

    if (fetching) return <Loader />;

    const { modelCursors: cursors } = data;

    return <ModelsWithCursors
        cursors={["", ...cursors]}
        size={size}
        nsfw={nsfw}
        platform={platform}
        type={type}
        filter={filter}
        page={page}
        setNsfw={setNsfw}
        setSize={setSize}
        setPlatform={setPlatform}
        setType={setType}
        setFilter={setFilter}
        setPage={setPage} />;
}

function ModelsWithCursors({ cursors, size, nsfw, platform, type, filter, page, setNsfw, setSize, setPlatform, setType, setFilter, setPage }: {
    cursors: string[],
    size: number,
    nsfw: boolean,
    platform: Platform,
    type: TypeEnum,
    filter: string,
    page: number,
    setNsfw: (nsfw: boolean) => void,
    setSize: (size: number) => void,
    setPlatform: (platform: Platform) => void,
    setType: (type: TypeEnum) => void,
    setFilter: (filter: string) => void,
    setPage: (page: number) => void
}) {
    const [{ data, fetching }] = useGetModelsQuery({ variables: { first: size, after: cursors[page], modelType: type, platform: platform, nsfw: nsfw } });
    const location = useLocation();
    const history = useNavigate();

    useEffect(() => {
        var hash = "#s=" + size;
        if (page) {
            hash += "&p=" + page;
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
        if (filter) {
            hash += "&f=" + filter;
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
            length={cursors.length}
            pageMove={setPage}
            setSize={setSize}
            setFilter={setFilter}
            setNsfw={setNsfw}
            setPlatform={setPlatform}
            setType={setType} />
        <div className="d-flex flex-wrap justify-content-between" style={{ margin: "0 -30px" }}>
            {data && data.models.items.map(model => (<ModelCard key={model.id} {...model} navigate={history} />))}
        </div>
        <ModelFilter
            index={1}
            filter={filter}
            page={page + 1}
            nsfw={nsfw}
            size={size}
            platform={platform}
            type={type}
            length={cursors.length}
            pageMove={setPage}
            setSize={setSize}
            setFilter={setFilter}
            setNsfw={setNsfw}
            setPlatform={setPlatform}
            setType={setType} />
    </div>);
}