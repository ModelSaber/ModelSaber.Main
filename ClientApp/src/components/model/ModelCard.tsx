import React, { Component } from "react";
import { mobile } from "../..";
import { ModelFragment, Status } from "../../graphqlTypes";
import { GetTumbnail } from "./GetTumbnail";

export class ModelCard extends Component<ModelFragment & { navigate: (path: string) => void; }> {
    vidRef: React.RefObject<HTMLVideoElement>;
    imgRef: React.RefObject<HTMLImageElement>;
    constructor(props: any) {
        super(props);
        this.imgRef = React.createRef();
        this.vidRef = React.createRef();
        this.fixWoopsieDaisy = this.fixWoopsieDaisy.bind(this);
    }

    getCheckColor() {
        if (this.props.status.includes(Status.Approved))
            return "bg-success";
        return "bg-warning";
    }

    getStatusIconType() {
        if (this.props.status.includes(Status.Approved))
            return (<i className="bi bi-check2" />);
        return (<i className="bi bi-question" />);
    }

    getPlatformIcon() {
        switch (this.props.platform) {
            case "PC":
                return (<i className="bi bi-display" />);
            default:
                return (<i className="bi bi-phone" />);
        }
    }

    fixWoopsieDaisy() {
        this.imgRef.current.style.display = "none";
        this.vidRef.current.style.display = "inline";
    }

    render() {
        return (<div className="card bg-dark mb-3" style={{ width: 259 }}>
            <div className="card-header" style={{ position: "relative" }}>
                <div style={{ width: 259, height: 259 }}>
                    <GetTumbnail {...this.props} css={{ width: 257, height: 257, margin: "-0.5rem -1rem" }} />
                </div>
                <h4 className="mt-3">
                    {this.props.name}
                </h4>
                <div className={this.getCheckColor() + " rounded-pill d-inline-flex justify-content-center text-dark me-4"} style={{ width: 20, height: 20 }}>{this.getStatusIconType()}</div>
                {this.getPlatformIcon()}
            </div>
            <div className="card-body">
                <div className="mb-2">
                    Tags
                    <br />
                    <div className="d-flex flex-wrap">
                        {this.props.tags.map(t => (<div key={this.props.id + "/" + t.id} className="rounded-pill outline outline-light d-inline text-nowrap me-1 ps-2 pe-2 mt-1" style={{ fontSize: ".75rem" }}>{t.name}</div>))}
                    </div>
                </div>
                <div style={{ width: "100%", borderBottom: "1px solid rgba(0, 0, 0, 0.125)" }} />
                <div>
                    Users:
                    <br />
                    {this.props.users.map((t, i, a) => {
                        return (<label key={t.id}>
                            <a href="#" className="link-primary" style={{ textDecoration: "none" }}>{t.name}</a>
                            {(i + 1) < a.length ? " & " : ""}
                        </label>);
                    })}
                </div>
            </div>
            <div className="card-footer">
                <div className="row" style={{ margin: "-0.5rem -1rem" }}>
                    {!mobile ? (<>
                        <a href="#" className="col-4 btn btn-sm btn-outline-light" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 0 }}>Install</a>
                        <a href="#" className="col-4 btn btn-sm btn-outline-light" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}>Download</a>
                        <button className="col-4 btn btn-sm btn-outline-light" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0 }} onClick={() => this.props.navigate(`/model/${this.props.cursor}`)}>Show</button>
                    </>)
                        : (<>
                            <button className="btn btn-sm btn-outline-light" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }} onClick={() => this.props.navigate(`/model/${this.props.cursor}`)}>Show</button>
                        </>)}
                </div>
            </div>
        </div>);
    }
}
