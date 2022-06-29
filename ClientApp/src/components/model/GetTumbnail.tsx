import React, { useState } from "react";
import { UnknownImage } from "./UnknownImage";

let internalCss: React.CSSProperties = { objectFit: "cover" };

export function GetTumbnail(props: { thumbnail: string; nsfw: boolean; css: React.CSSProperties; }) {
    const [error, setError] = useState(false);

    function onError() {
        setError(true);
    }

    const date = new Date();

    if (error || (date.getDate() === 1 && date.getMonth() === 3)) {
        if (date.getDate() === 1 && date.getMonth() === 3 && date.getHours() < 12)
            return (<video className="card-img-top" style={props.css} autoPlay loop muted playsInline>
                <source src="isfmoment.webm" type="video/webm"></source>
            </video>);
        return (<UnknownImage css={props.css} date={date} />);
    }

    let thumb = props.thumbnail;
    if (thumb.endsWith(".webm")) {
        return (<video className={"card-img-top" + (props.nsfw ? " card-img-blur" : "")} style={props.css} autoPlay loop muted playsInline onError={onError}>
            <source src={props.thumbnail} type="video/webm"></source>
        </video>);
    }
    else {
        return (<img className={"card-img-top" + (props.nsfw ? " card-img-blur" : "")} src={props.thumbnail} alt="you're not supposed to see this" style={{ ...internalCss, ...props.css }} onError={onError} />);
    }
}
