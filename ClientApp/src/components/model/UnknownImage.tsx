import React from "react";

let internalCss: React.CSSProperties = { backgroundColor: "rgba(0,0,0,0.3)", boxShadow: "0 0 10px 2px rgba(127,127,127,0.6) inset", borderTopLeftRadius: "0.25rem", borderTopRightRadius: "0.25rem", textAlign: "center" };

export function UnknownImage(props: { css: React.CSSProperties; date: Date; }) {
    const date = props.date;
    function isAprilFirst() {
        return date.getDate() === 1 && date.getMonth() === 3 && date.getHours() >= 12;
    }
    return (
        <div style={{ ...internalCss, ...props.css }}>
            {isAprilFirst() ?
                (<video className="card-img-top" style={{ width: 230 }} autoPlay loop muted playsInline>
                    <source src="unknown.webm" type="video/webm"></source>
                </video>)
                :
                (<svg width="200" height="200" viewBox="0 0 1000 1000" className="defaultImg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: `0 29.5px`, padding: 15, opacity: 0.6 }}>
                    <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="132.3545" y1="714.4818" x2="883.6826" y2="276.1613">
                        <stop offset="0" style={{ stopColor: "#BE10FF" }} />
                        <stop offset="1" style={{ stopColor: "#1FCC9E" }} />
                    </linearGradient>
                    <path className="st0" d="M899.89,721.71V278.29c0-5.67-3.03-10.91-7.94-13.75L507.94,42.82c-4.91-2.84-10.96-2.84-15.88,0
        L108.04,264.54c-4.91,2.84-7.94,8.08-7.94,13.75v443.43c0,5.67,3.03,10.91,7.94,13.75l384.02,221.71
        c4.91,2.84,10.96,2.84,15.88,0l384.02-221.71C896.87,732.63,899.89,727.38,899.89,721.71z"/>
                    <g>
                        <path className="st1" d="M731.66,368.56c45.23-24.27,94.99-36.55,144.81-36.88c-5-27.55-19.03-52.65-39.84-71.3
            C811.41,303.87,775.66,341.25,731.66,368.56z"/>
                        <path className="st1" d="M268.34,368.55c-44-27.31-79.75-64.69-104.96-108.18c-20.81,18.65-34.84,43.74-39.84,71.3
            C173.35,332.01,223.11,344.29,268.34,368.55z"/>
                        <path className="st1" d="M646.89,417.5c-91.72,49.21-202.06,49.21-293.78,0C444.24,474.05,500,573.83,500,681.54
            C500,573.82,555.76,474.05,646.89,417.5z"/>
                        <path className="st1" d="M500,759.8c0,53.97-14.03,105.92-39.46,151.47c25.61,8.45,53.3,8.45,78.91,0
            C514.03,865.72,500,813.77,500,759.8z"/>
                    </g>
                    <path className="st1" d="M860.3,219.27L562.97,47.61c-38.97-22.5-86.98-22.5-125.94,0L139.7,219.27
        c-38.97,22.5-62.97,64.07-62.97,109.07v343.32c0,44.99,24,86.57,62.97,109.07l297.33,171.66c38.97,22.5,86.98,22.5,125.94,0
        L860.3,780.73c38.97-22.5,62.97-64.08,62.97-109.07V328.34C923.27,283.34,899.27,241.77,860.3,219.27z M878.55,645.84
        c0,45-24,86.57-62.97,109.07l-252.6,145.84c-38.97,22.5-86.98,22.5-125.94,0l-252.6-145.84c-38.97-22.5-62.97-64.07-62.97-109.07
        V354.16c0-45,24-86.57,62.97-109.07l252.6-145.84c38.97-22.5,86.98-22.5,125.94,0l252.6,145.84
        c38.97,22.5,62.97,64.07,62.97,109.07V645.84z"/>
                    <path className="st1" d="M297.23,669.05l90.96-107.13c2.12-2.5,1.42-6.31-1.44-7.9L204.82,453.18c-4.34-2.41-9.26,2.07-7.27,6.62
        l90.96,207.97C290.06,671.29,294.74,671.98,297.23,669.05z"/>
                </svg>)}
            <label style={{ padding: "0 7px" }}>Could not find image for model.</label>
        </div>
    );
}