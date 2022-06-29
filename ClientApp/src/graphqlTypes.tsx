import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Byte: any;
  /** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
  DateTime: any;
  Guid: any;
  UInt: any;
  /** Stringed representation of ulong due to javascript cant handle 64 bit large integers without derping */
  UInt64: any;
};

/** A connection from an object to a list of objects of type `Model`. */
export type ModelConnection = {
  __typename?: 'ModelConnection';
  /** A list of all of the edges returned in the connection. */
  edges?: Maybe<Array<Maybe<ModelEdge>>>;
  /** A list of all of the objects returned in the connection. This is a convenience field provided for quickly exploring the API; rather than querying for "{ edges { node } }" when no edge data is needed, this field can be used instead. Note that when clients like Relay need to fetch the "cursor" field on the edge to enable efficient pagination, this shortcut cannot be used, and the full "{ edges { node } } " version should be used instead. */
  items?: Maybe<Array<Maybe<ModelType>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A count of the total number of objects in this connection, ignoring pagination. This allows a client to fetch the first five objects by passing "5" as the argument to `first`, then fetch the total count so it could display "5 of 83", for example. In cases where we employ infinite scrolling or don't have an exact count of entries, this field will return `null`. */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection from an object to another object of type `Model`. */
export type ModelEdge = {
  __typename?: 'ModelEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ModelType>;
};

export type ModelSaberMutation = {
  __typename?: 'ModelSaberMutation';
  /** Modifies votes for a model. */
  vote?: Maybe<VoteType>;
};


export type ModelSaberMutationVoteArgs = {
  voteArgs: VoteInputType;
};

export type ModelSaberQuery = {
  __typename?: 'ModelSaberQuery';
  /** Returns the time the API was built. */
  buildTime?: Maybe<Scalars['DateTime']>;
  /** Single model */
  model?: Maybe<ModelType>;
  /** Lists cursors based on pagination size */
  modelCursors?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Gets the current users vote. */
  modelVote?: Maybe<VoteType>;
  /** Gets the vote stats for the model. */
  modelVotes?: Maybe<Array<Maybe<VoteCompoundType>>>;
  /** Model list */
  models?: Maybe<ModelConnection>;
  /** You wanted yer tags? */
  tags?: Maybe<TagConnection>;
  /** The entire user list */
  users?: Maybe<Array<Maybe<UserType>>>;
  /** Returns the current version of the API. */
  version?: Maybe<Scalars['String']>;
};


export type ModelSaberQueryModelArgs = {
  id: Scalars['String'];
};


export type ModelSaberQueryModelCursorsArgs = {
  nsfw?: InputMaybe<Scalars['Boolean']>;
  order?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Array<InputMaybe<Status>>>;
};


export type ModelSaberQueryModelVoteArgs = {
  id: Scalars['String'];
};


export type ModelSaberQueryModelVotesArgs = {
  id: Scalars['String'];
};


export type ModelSaberQueryModelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  modelType?: InputMaybe<TypeEnum>;
  nameFilter?: InputMaybe<Scalars['String']>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
  platform?: InputMaybe<Platform>;
  status?: InputMaybe<Array<InputMaybe<Status>>>;
};


export type ModelSaberQueryTagsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  nameFilter?: InputMaybe<Scalars['String']>;
};

export type ModelType = {
  __typename?: 'ModelType';
  cursor: Scalars['String'];
  date?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  downloadPath: Scalars['String'];
  hash?: Maybe<Scalars['String']>;
  /** The id of the model */
  id: Scalars['Guid'];
  mainUser?: Maybe<UserType>;
  name: Scalars['String'];
  nsfw: Scalars['Boolean'];
  /** The platform the model is for */
  platform: Platform;
  /** The status of the model */
  status?: Maybe<Array<Maybe<Status>>>;
  tags?: Maybe<Array<Maybe<TagType>>>;
  thumbnail: Scalars['String'];
  /** What model type it is */
  type: TypeEnum;
  userId: Scalars['UInt64'];
  users?: Maybe<Array<Maybe<UserType>>>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** Platform type */
export enum Platform {
  /** Platform PC */
  Pc = 'PC',
  /** Platform Quest */
  Quest = 'QUEST'
}

/** Model status */
export enum Status {
  /** ApprovalRequired */
  ApprovalRequired = 'APPROVAL_REQUIRED',
  /** Approved */
  Approved = 'APPROVED',
  /** Featured */
  Featured = 'FEATURED',
  /** Published */
  Published = 'PUBLISHED',
  /** Unpublished */
  Unpublished = 'UNPUBLISHED'
}

/** A connection from an object to a list of objects of type `Tag`. */
export type TagConnection = {
  __typename?: 'TagConnection';
  /** A list of all of the edges returned in the connection. */
  edges?: Maybe<Array<Maybe<TagEdge>>>;
  /** A list of all of the objects returned in the connection. This is a convenience field provided for quickly exploring the API; rather than querying for "{ edges { node } }" when no edge data is needed, this field can be used instead. Note that when clients like Relay need to fetch the "cursor" field on the edge to enable efficient pagination, this shortcut cannot be used, and the full "{ edges { node } } " version should be used instead. */
  items?: Maybe<Array<Maybe<TagType>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A count of the total number of objects in this connection, ignoring pagination. This allows a client to fetch the first five objects by passing "5" as the argument to `first`, then fetch the total count so it could display "5 of 83", for example. In cases where we employ infinite scrolling or don't have an exact count of entries, this field will return `null`. */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection from an object to another object of type `Tag`. */
export type TagEdge = {
  __typename?: 'TagEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<TagType>;
};

export type TagType = {
  __typename?: 'TagType';
  id: Scalars['UInt'];
  /** Model list */
  models?: Maybe<ModelConnection>;
  name: Scalars['String'];
};


export type TagTypeModelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
};

export enum TypeEnum {
  Avatar = 'AVATAR',
  Effect = 'EFFECT',
  HealthBar = 'HEALTH_BAR',
  Note = 'NOTE',
  Platform = 'PLATFORM',
  Saber = 'SABER',
  Wall = 'WALL'
}

/** UserLevels for what your user is */
export enum UserLevel {
  /** Praise them */
  Admin = 'ADMIN',
  /** Be carefull what you do */
  Moderator = 'MODERATOR',
  /** Just your average Joe */
  Normal = 'NORMAL',
  /** Oh you just got fancy */
  Verified = 'VERIFIED'
}

export type UserTagType = {
  __typename?: 'UserTagType';
  name?: Maybe<Scalars['String']>;
};

export type UserType = {
  __typename?: 'UserType';
  avatar?: Maybe<Scalars['String']>;
  bSaber?: Maybe<Scalars['String']>;
  discordId?: Maybe<Scalars['UInt64']>;
  id: Scalars['UInt'];
  level?: Maybe<UserLevel>;
  /** Model list */
  models?: Maybe<ModelConnection>;
  name?: Maybe<Scalars['String']>;
  userTags?: Maybe<Array<Maybe<UserTagType>>>;
};


export type UserTypeModelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
};

export type VoteCompoundType = {
  __typename?: 'VoteCompoundType';
  count?: Maybe<Scalars['Int']>;
  down?: Maybe<Scalars['Boolean']>;
};

export type VoteInputType = {
  id: Scalars['String'];
  modelId: Scalars['UInt'];
  platform: Scalars['String'];
  vote: Scalars['Byte'];
};

export type VoteType = {
  __typename?: 'VoteType';
  downVote: Scalars['Boolean'];
  gameId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['UInt']>;
};

export type GetApiVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetApiVersionQuery = { __typename?: 'ModelSaberQuery', version?: string | null, buildTime?: any | null };

export type GetModelFullQueryVariables = Exact<{
  modelId: Scalars['String'];
}>;


export type GetModelFullQuery = { __typename?: 'ModelSaberQuery', model?: { __typename?: 'ModelType', id: any, name: string, status?: Array<Status | null> | null, platform: Platform, type: TypeEnum, description?: string | null, thumbnail: string, downloadPath: string, nsfw: boolean, users?: Array<{ __typename?: 'UserType', name?: string | null, discordId?: any | null, id: any } | null> | null, tags?: Array<{ __typename?: 'TagType', name: string, id: any } | null> | null } | null };

export type GetModelCursorsQueryVariables = Exact<{
  size?: InputMaybe<Scalars['Int']>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
}>;


export type GetModelCursorsQuery = { __typename?: 'ModelSaberQuery', modelCursors?: Array<string | null> | null };

export type GetModelsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  nameFilter?: InputMaybe<Scalars['String']>;
  modelType?: InputMaybe<TypeEnum>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
  platform?: InputMaybe<Platform>;
}>;


export type GetModelsQuery = { __typename?: 'ModelSaberQuery', models?: { __typename?: 'ModelConnection', items?: Array<{ __typename?: 'ModelType', id: any, name: string, status?: Array<Status | null> | null, platform: Platform, cursor: string, thumbnail: string, nsfw: boolean, users?: Array<{ __typename?: 'UserType', name?: string | null, discordId?: any | null, id: any } | null> | null, tags?: Array<{ __typename?: 'TagType', name: string, id: any } | null> | null } | null> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type ModelFragment = { __typename?: 'ModelType', id: any, name: string, status?: Array<Status | null> | null, platform: Platform, cursor: string, thumbnail: string, nsfw: boolean, users?: Array<{ __typename?: 'UserType', name?: string | null, discordId?: any | null, id: any } | null> | null, tags?: Array<{ __typename?: 'TagType', name: string, id: any } | null> | null };

export type GetModelVotesQueryVariables = Exact<{
  modelId: Scalars['String'];
}>;


export type GetModelVotesQuery = { __typename?: 'ModelSaberQuery', modelVotes?: Array<{ __typename?: 'VoteCompoundType', down?: boolean | null, count?: number | null } | null> | null };

export type SendVoteMutationVariables = Exact<{
  modelId: Scalars['UInt'];
  userId: Scalars['String'];
  vote: Scalars['Byte'];
}>;


export type SendVoteMutation = { __typename?: 'ModelSaberMutation', vote?: { __typename?: 'VoteType', downVote: boolean, gameId?: string | null, userId?: any | null } | null };

export type GetUserVoteQueryVariables = Exact<{
  modelId: Scalars['String'];
}>;


export type GetUserVoteQuery = { __typename?: 'ModelSaberQuery', modelVote?: { __typename?: 'VoteType', downVote: boolean, gameId?: string | null, userId?: any | null } | null };

export const ModelFragmentDoc = gql`
    fragment Model on ModelType {
  id
  name
  status
  platform
  cursor
  users {
    name
    discordId
    id
  }
  tags {
    name
    id
  }
  thumbnail
  nsfw
}
    `;
export const GetApiVersionDocument = gql`
    query GetApiVersion {
  version
  buildTime
}
    `;

export function useGetApiVersionQuery(options?: Omit<Urql.UseQueryArgs<GetApiVersionQueryVariables>, 'query'>) {
  return Urql.useQuery<GetApiVersionQuery>({ query: GetApiVersionDocument, ...options });
};
export const GetModelFullDocument = gql`
    query GetModelFull($modelId: String!) {
  model(id: $modelId) {
    id
    name
    status
    platform
    type
    description
    users {
      name
      discordId
      id
    }
    tags {
      name
      id
    }
    thumbnail
    downloadPath
    nsfw
  }
}
    `;

export function useGetModelFullQuery(options: Omit<Urql.UseQueryArgs<GetModelFullQueryVariables>, 'query'>) {
  return Urql.useQuery<GetModelFullQuery>({ query: GetModelFullDocument, ...options });
};
export const GetModelCursorsDocument = gql`
    query GetModelCursors($size: Int, $nsfw: Boolean) {
  modelCursors(size: $size, nsfw: $nsfw)
}
    `;

export function useGetModelCursorsQuery(options?: Omit<Urql.UseQueryArgs<GetModelCursorsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetModelCursorsQuery>({ query: GetModelCursorsDocument, ...options });
};
export const GetModelsDocument = gql`
    query GetModels($first: Int, $after: String, $nameFilter: String, $modelType: TypeEnum, $nsfw: Boolean, $platform: Platform) {
  models(
    first: $first
    after: $after
    nameFilter: $nameFilter
    modelType: $modelType
    nsfw: $nsfw
    platform: $platform
  ) {
    items {
      ...Model
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${ModelFragmentDoc}`;

export function useGetModelsQuery(options?: Omit<Urql.UseQueryArgs<GetModelsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetModelsQuery>({ query: GetModelsDocument, ...options });
};
export const GetModelVotesDocument = gql`
    query GetModelVotes($modelId: String!) {
  modelVotes(id: $modelId) {
    down
    count
  }
}
    `;

export function useGetModelVotesQuery(options: Omit<Urql.UseQueryArgs<GetModelVotesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetModelVotesQuery>({ query: GetModelVotesDocument, ...options });
};
export const SendVoteDocument = gql`
    mutation SendVote($modelId: UInt!, $userId: String!, $vote: Byte!) {
  vote(voteArgs: {modelId: $modelId, id: $userId, platform: "web", vote: $vote}) {
    downVote
    gameId
    userId
  }
}
    `;

export function useSendVoteMutation() {
  return Urql.useMutation<SendVoteMutation, SendVoteMutationVariables>(SendVoteDocument);
};
export const GetUserVoteDocument = gql`
    query GetUserVote($modelId: String!) {
  modelVote(id: $modelId) {
    downVote
    gameId
    userId
  }
}
    `;

export function useGetUserVoteQuery(options: Omit<Urql.UseQueryArgs<GetUserVoteQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserVoteQuery>({ query: GetUserVoteDocument, ...options });
};