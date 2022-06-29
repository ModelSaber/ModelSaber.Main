import React, { useEffect } from "react";
import { Platform, TypeEnum, useGetModelCursorsQuery } from "../../graphqlTypes";
import "./ModelFilter.scss";

type ModelFilterProps = ModelFilterState & ModelFilterFunctions;

interface ModelFilterFunctions {
    pageMove: (page: number) => void;
    setSize: (size: number) => void;
    setFilter: (filter: string) => void;
    setNsfw: (nsfw: boolean) => void;
    setPlatform: (platform: Platform) => void;
    setType: (type: TypeEnum) => void;
}

export interface ModelFilterState {
    size: number;
    page: number;
    filter: string;
    nsfw: boolean;
    platform: Platform;
    type: TypeEnum;
    index: number;
    cursors: string[];
}

function ModelFilterFunc(props: ModelFilterProps) {
    const page = props.page;
    const size = props.size;
    const nsfw = props.nsfw;
    const platform = props.platform;
    const type = props.type;
    const index = props.index;
    const cursors = props.cursors;
    //const filter = props.filter;

    function updateSize(s: number) {
        props.setSize(s);
    }

    function updatePage(p: number) {
        if (p > cursors.length) p = 1;
        else if (p < 1) p = cursors.length;

        props.pageMove(p - 1);
    }

    // function updateFilter(f: string) {
    //     props.setFilter(f);
    // }

    function getPages(length: number) {
        var userPagesFirst = Array(length).fill(null).map((_, i) => i + 1);
        var userPagesStart: number[] = [];
        var userPagesMiddle: number[] = [];
        var userPagesEnd: number[] = [];
        if (userPagesFirst.length > 8) {
            if (page > 5) {
                userPagesStart = [userPagesFirst[0]];
                if (userPagesFirst.length < page + 5) {
                    userPagesEnd = userPagesFirst.slice(userPagesFirst.length - 7, userPagesFirst.length);
                }
                else {
                    userPagesMiddle = userPagesFirst.slice(page - 3, 4 + (page - 2));
                    userPagesEnd = [userPagesFirst.pop()];
                }
            }
            else {
                userPagesMiddle = userPagesFirst.slice(0, 7);
                userPagesEnd = [userPagesFirst.pop()];
            }
        }
        else {
            userPagesMiddle = userPagesFirst;
        }
        return (<>
            {userPagesStart.length > 0 ? userPagesStart.map(f => (<li key={f} className={"page-item" + (page === f ? " active" : "")}>
                <a className="page-link" href="#" key={f} onClick={() => updatePage(f)}>{f}</a>
            </li>)) : null}
            {userPagesStart.length > 0 ? (<li className="page-item disabled">
                <span className="page-link">...</span>
            </li>) : null}
            {userPagesMiddle.length > 0 ? userPagesMiddle.map(f => (<li key={f} className={"page-item" + (page === f ? " active" : "")}>
                <a className="page-link" href="#" key={f} onClick={() => updatePage(f)}>{f}</a>
            </li>)) : null}
            {userPagesMiddle.length > 0 ? (<li className="page-item disabled">
                <span className="page-link">...</span>
            </li>) : null}
            {userPagesEnd.length > 0 ? userPagesEnd.map(f => (<li key={f} className={"page-item" + (page === f ? " active" : "")}>
                <a className="page-link" href="#" key={f} onClick={() => updatePage(f)}>{f}</a>
            </li>)) : null}
        </>);
    }

    return (
        <nav>
            <ul className="pagination me-2">
                <li className="page-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Previous"><a className="page-link" href="#" onClick={() => updatePage(page - 1)}><i className="bi bi-arrow-left"></i></a></li>
                {getPages(cursors.length)}
                <li className="page-item me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Next" ><a className="page-link" href="#" onClick={() => updatePage(page + 1)} style={{ borderTopRightRadius: "0.25rem", borderBottomRightRadius: "0.25rem" }}><i className="bi bi-arrow-right"></i></a></li>
                <li className="page-item-dropdown me-2">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="pageSizeDropdown" data-bs-toggle="dropdown" aria-expanded="false">Page Size</button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="pageSizeDropdown">
                            <li><a className={"dropdown-item" + (size === 10 ? " active" : "")} href="#" onClick={() => updateSize(10)}>10</a></li>
                            <li><a className={"dropdown-item" + (size === 20 ? " active" : "")} href="#" onClick={() => updateSize(20)}>20</a></li>
                            <li><a className={"dropdown-item" + (size === 40 ? " active" : "")} href="#" onClick={() => updateSize(40)}>40</a></li>
                            <li><a className={"dropdown-item" + (size === 60 ? " active" : "")} href="#" onClick={() => updateSize(60)}>60</a></li>
                            <li><a className={"dropdown-item" + (size === 80 ? " active" : "")} href="#" onClick={() => updateSize(80)}>80</a></li>
                            <li><a className={"dropdown-item" + (size === 100 ? " active" : "")} href="#" onClick={() => updateSize(100)}>100</a></li>
                        </ul>
                    </div>
                </li>
                <li className="page-item-dropdown">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="filterSettingsDropdown" data-bs-toggle="dropdown" aria-expanded="false">Filter Settings</button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="filterSettingsDropdown">
                            <li className="ps-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="nsfwSwitch" onChange={(event) => props.setNsfw(event.target.checked)} checked={nsfw} />
                                    <label className="form-check-label" htmlFor="nsfwSwitch">NSFW</label>
                                </div>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"platformRadio" + index} id="pcRadio" onChange={() => props.setPlatform(Platform.Pc)} checked={platform === Platform.Pc} />
                                    <label className="form-check-label" htmlFor="pcRadio">PC</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"platformRadio" + index} id="questRadio" onChange={() => props.setPlatform(Platform.Quest)} checked={platform === Platform.Quest} />
                                    <label className="form-check-label" htmlFor="questRadio">Quest</label>
                                </div>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="allRadio" onChange={() => props.setType(undefined)} checked={type === undefined} />
                                    <label className="form-check-label" htmlFor="allRadio">All</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="avatarRadio" onChange={() => props.setType(TypeEnum.Avatar)} checked={type === TypeEnum.Avatar} />
                                    <label className="form-check-label" htmlFor="avatarRadio">Avatar</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="effectRadio" onChange={() => props.setType(TypeEnum.Effect)} checked={type === TypeEnum.Effect} />
                                    <label className="form-check-label" htmlFor="effectRadio">Effect</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="HealthBarRadio" onChange={() => props.setType(TypeEnum.HealthBar)} checked={type === TypeEnum.HealthBar} />
                                    <label className="form-check-label" htmlFor="HealthBarRadio">Health Bar</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="noteRadio" onChange={() => props.setType(TypeEnum.Note)} checked={type === TypeEnum.Note} />
                                    <label className="form-check-label" htmlFor="noteRadio">Note</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="platformRadio" onChange={() => props.setType(TypeEnum.Platform)} checked={type === TypeEnum.Platform} />
                                    <label className="form-check-label" htmlFor="platformRadio">Platform</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="saberRadio" onChange={() => props.setType(TypeEnum.Saber)} checked={type === TypeEnum.Saber} />
                                    <label className="form-check-label" htmlFor="saberRadio">Saber</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id="wallRadio" onChange={() => props.setType(TypeEnum.Wall)} checked={type === TypeEnum.Wall} />
                                    <label className="form-check-label" htmlFor="wallRadio">Wall</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            {/* <input value={filter} onInput={(event) => updateFilter(event.currentTarget.value)} /> */}
        </nav>
    );
}

export default ModelFilterFunc;