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
    length: number;
}

function ModelFilterFunc(props: ModelFilterProps) {
    const page = props.page;
    const size = props.size;
    const nsfw = props.nsfw;
    const platform = props.platform;
    const type = props.type;
    const index = props.index;
    const length = props.length;
    const pageMove = props.pageMove;
    //const filter = props.filter;

    function updateSize(s: number) {
        props.setSize(s);
    }

    function updatePage(p: number) {
        if (p > length) p = 1;
        else if (p < 1) p = length;

        pageMove(p - 1);
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
                <div className="page-link" key={f} onClick={() => updatePage(f)}>{f}</div>
            </li>)) : null}
            {userPagesStart.length > 0 ? (<li className="page-item disabled">
                <span className="page-link">...</span>
            </li>) : null}
            {userPagesMiddle.length > 0 ? userPagesMiddle.map(f => (<li key={f} className={"page-item" + (page === f ? " active" : "")}>
                <div className="page-link" key={f} onClick={() => updatePage(f)}>{f}</div>
            </li>)) : null}
            {userPagesMiddle.length > 0 && length > 8 ? (<li className="page-item disabled">
                <span className="page-link">...</span>
            </li>) : null}
            {userPagesEnd.length > 0 ? userPagesEnd.map(f => (<li key={f} className={"page-item" + (page === f ? " active" : "")}>
                <div className="page-link" key={f} onClick={() => updatePage(f)}>{f}</div>
            </li>)) : null}
        </>);
    }

    return (
        <nav>
            <ul className="pagination me-2">
                <li className="page-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Previous"><div className="page-link" onClick={() => updatePage(page - 1)}><i className="bi bi-arrow-left"></i></div></li>
                {getPages(length)}
                <li className="page-item me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Next" ><div className="page-link" onClick={() => updatePage(page + 1)} style={{ borderTopRightRadius: "0.25rem", borderBottomRightRadius: "0.25rem" }}><i className="bi bi-arrow-right"></i></div></li>
                <li className="page-item-dropdown me-2">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id={"pageSizeDropdown" + index} data-bs-toggle="dropdown" aria-expanded="false">Page Size</button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby={"pageSizeDropdown" + index}>
                            <li><div className={"dropdown-item" + (size === 10 ? " active" : "")} onClick={() => updateSize(10)}>10</div></li>
                            <li><div className={"dropdown-item" + (size === 20 ? " active" : "")} onClick={() => updateSize(20)}>20</div></li>
                            <li><div className={"dropdown-item" + (size === 40 ? " active" : "")} onClick={() => updateSize(40)}>40</div></li>
                            <li><div className={"dropdown-item" + (size === 60 ? " active" : "")} onClick={() => updateSize(60)}>60</div></li>
                            <li><div className={"dropdown-item" + (size === 80 ? " active" : "")} onClick={() => updateSize(80)}>80</div></li>
                            <li><div className={"dropdown-item" + (size === 100 ? " active" : "")} onClick={() => updateSize(100)}>100</div></li>
                        </ul>
                    </div>
                </li>
                <li className="page-item-dropdown">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id={"filterSettingsDropdown" + index} data-bs-toggle="dropdown" aria-expanded="false">Filter Settings</button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby={"filterSettingsDropdown" + index}>
                            <li className="ps-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id={"nsfwSwitch" + index} onChange={(event) => props.setNsfw(event.target.checked)} checked={nsfw} />
                                    <label className="form-check-label" htmlFor={"nsfwSwitch" + index}>NSFW</label>
                                </div>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"platformRadio" + index} id={"pcRadio" + index} onChange={() => props.setPlatform(Platform.Pc)} checked={platform === Platform.Pc} />
                                    <label className="form-check-label" htmlFor={"pcRadio" + index}>PC</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"platformRadio" + index} id={"questRadio" + index} onChange={() => props.setPlatform(Platform.Quest)} checked={platform === Platform.Quest} />
                                    <label className="form-check-label" htmlFor={"questRadio" + index}>Quest</label>
                                </div>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"allRadio" + index} onChange={() => props.setType(undefined)} checked={type === undefined} />
                                    <label className="form-check-label" htmlFor={"allRadio" + index}>All</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"avatarRadio" + index} onChange={() => props.setType(TypeEnum.Avatar)} checked={type === TypeEnum.Avatar} />
                                    <label className="form-check-label" htmlFor={"avatarRadio" + index}>Avatar</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"effectRadio" + index} onChange={() => props.setType(TypeEnum.Effect)} checked={type === TypeEnum.Effect} />
                                    <label className="form-check-label" htmlFor={"effectRadio" + index}>Effect</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"HealthBarRadio" + index} onChange={() => props.setType(TypeEnum.HealthBar)} checked={type === TypeEnum.HealthBar} />
                                    <label className="form-check-label" htmlFor={"HealthBarRadio" + index}>Health Bar</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"noteRadio" + index} onChange={() => props.setType(TypeEnum.Note)} checked={type === TypeEnum.Note} />
                                    <label className="form-check-label" htmlFor={"noteRadio" + index}>Note</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"platformRadio" + index} onChange={() => props.setType(TypeEnum.Platform)} checked={type === TypeEnum.Platform} />
                                    <label className="form-check-label" htmlFor={"platformRadio" + index}>Platform</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"saberRadio" + index} onChange={() => props.setType(TypeEnum.Saber)} checked={type === TypeEnum.Saber} />
                                    <label className="form-check-label" htmlFor={"saberRadio" + index}>Saber</label>
                                </div>
                            </li>
                            <li className="ps-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={"typeRadio" + index} id={"wallRadio" + index} onChange={() => props.setType(TypeEnum.Wall)} checked={type === TypeEnum.Wall} />
                                    <label className="form-check-label" htmlFor={"wallRadio" + index}>Wall</label>
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