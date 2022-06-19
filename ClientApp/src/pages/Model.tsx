import React from "react";
import { useGetModelFullQuery, useGetModelVotesQuery, useGetUserVoteQuery, useSendVoteMutation } from "../graphqlTypes";
import { GetTumbnail } from "../components/model/GetTumbnail";
import { Loader } from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { getParamFromLogin, mobile } from "..";


export default function Model() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [{ data, fetching }] = useGetModelFullQuery({ variables: { modelId: id } });
    const votes = useGetModelVotesQuery({ variables: { modelId: id } });
    const vote = useGetUserVoteQuery({ variables: { modelId: id } });
    const sendVote = useSendVoteMutation();

    if (fetching) return (<Loader></Loader>);
    if (!data) {
        navigate("/");
        return (<></>);
    }

    function submitVote(bool: boolean) {
        var k = vote[0].data.modelVote.downVote == bool ? 2 : bool ? 0 : 1;
        sendVote[1]({ modelId: data.model.id, userId: getParamFromLogin("discordId"), vote: k }).then(() => {
            votes[1]();
            vote[1]();
        });
    }

    let model = data.model;
    return !!model ?
        (<>
            <div className="row mt-2">
                <div className="col-4 border-end pb-2">
                    <GetTumbnail {...model} css={{ width: "100%", borderRadius: "0.5rem" }} />
                </div>
                <div className="col-8">
                    <h1>{model.name}</h1>
                    <div className="row border-top pt-1">
                        <h3>Users</h3>
                        <div className="row" style={{ marginTop: -12 }}>
                            {model.users.map((t: any) => (<a key={t.discordId} href="#" className="fs-5 text-decoration-none" style={{ cursor: "pointer" }}>{t.name}</a>))}
                        </div>
                    </div>
                    {!mobile ? (<div className="row border-top pt-2 pb-2">
                        <div className="col-6 text-center"><a href={`modelsaber:${model.type}:${model.id}`} className="h-100 w-100 btn btn-dark">One Click Install</a></div>
                        <div className="col-6 text-center"><a href={model.downloadPath} target="_blank" className="h-100 w-100 btn btn-dark" rel="noopener noreferrer">Download</a></div>
                    </div>) : (<></>)}
                    <div className="row border-top pt-1">
                        <h5 className="mb-0">Tags</h5>
                        <div className="d-flex flex-wrap">
                            {model.tags.map((t: any) => (<div key={t.id} className="d-inline p-1 ps-2 pe-2 me-1 mt-2 bg-dark rounded-pill text-nowrap">{t.name}</div>))}
                        </div>
                    </div>
                    {!!model.description ?
                        (<div className="row mt-2 border-top pt-1">
                            <h5>Description</h5>
                            <div>
                                {model.description}
                            </div>
                        </div>)
                        :
                        (<></>)}
                </div>
                <div className="row border-top pt-1">
                    <div className="row">
                        <div className="d-flex">
                            {votes[0].fetching || vote[0].fetching ? (<h3>Loading...</h3>) : vote[0].error ? (<></>) : (<>
                                <h3 className="col-1">Votes:</h3>
                                <div className="col-2" onClick={() => submitVote(false)}><i className={"bi bi-hand-thumbs-up-fill btn btn-secondary" + (!vote[0].data?.modelVote?.downVote ? " active" : "")}></i><label className="ps-2">{votes[0].data.modelVotes.find(t => !t.down)?.count || 0}</label></div>
                                <div className="col-2" onClick={() => submitVote(true)}><i className={"bi bi-hand-thumbs-down-fill btn btn-secondary" + (vote[0].data?.modelVote?.downVote ? " active" : "")}></i><label className="ps-2">{votes[0].data.modelVotes.find(t => t.down)?.count || 0}</label></div>
                                <div className="col-7"></div>
                            </>)}
                        </div>
                    </div>
                </div>
                <pre>
                    {JSON.stringify(model, null, 4)}
                </pre>
            </div>
        </>)
        :
        (<></>);
}