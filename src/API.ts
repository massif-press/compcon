/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserDataInput = {
  id?: string | null,
  user_id: string,
  theme?: string | null,
  achievements?: Array< string | null > | null,
  lcp_data?: string | null,
  pilots?: Array< string | null > | null,
  npcs?: Array< string | null > | null,
  encounters?: Array< string | null > | null,
  missions?: Array< string | null > | null,
  active_missions?: Array< string | null > | null,
  welcome_hash?: string | null,
  sync_frequency?: string | null,
  sync_options?: string | null,
  view_options?: string | null,
  _version?: number | null,
};

export type ModelUserDataConditionInput = {
  user_id?: ModelStringInput | null,
  theme?: ModelStringInput | null,
  achievements?: ModelStringInput | null,
  lcp_data?: ModelStringInput | null,
  pilots?: ModelStringInput | null,
  npcs?: ModelStringInput | null,
  encounters?: ModelStringInput | null,
  missions?: ModelStringInput | null,
  active_missions?: ModelStringInput | null,
  welcome_hash?: ModelStringInput | null,
  sync_frequency?: ModelStringInput | null,
  sync_options?: ModelStringInput | null,
  view_options?: ModelStringInput | null,
  and?: Array< ModelUserDataConditionInput | null > | null,
  or?: Array< ModelUserDataConditionInput | null > | null,
  not?: ModelUserDataConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateUserDataInput = {
  id: string,
  user_id?: string | null,
  theme?: string | null,
  achievements?: Array< string | null > | null,
  lcp_data?: string | null,
  pilots?: Array< string | null > | null,
  npcs?: Array< string | null > | null,
  encounters?: Array< string | null > | null,
  missions?: Array< string | null > | null,
  active_missions?: Array< string | null > | null,
  welcome_hash?: string | null,
  sync_frequency?: string | null,
  sync_options?: string | null,
  view_options?: string | null,
  _version?: number | null,
};

export type DeleteUserDataInput = {
  id?: string | null,
  _version?: number | null,
};

export type ModelUserDataFilterInput = {
  id?: ModelIDInput | null,
  user_id?: ModelStringInput | null,
  theme?: ModelStringInput | null,
  achievements?: ModelStringInput | null,
  lcp_data?: ModelStringInput | null,
  pilots?: ModelStringInput | null,
  npcs?: ModelStringInput | null,
  encounters?: ModelStringInput | null,
  missions?: ModelStringInput | null,
  active_missions?: ModelStringInput | null,
  welcome_hash?: ModelStringInput | null,
  sync_frequency?: ModelStringInput | null,
  sync_options?: ModelStringInput | null,
  view_options?: ModelStringInput | null,
  and?: Array< ModelUserDataFilterInput | null > | null,
  or?: Array< ModelUserDataFilterInput | null > | null,
  not?: ModelUserDataFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type CreateUserDataMutationVariables = {
  input: CreateUserDataInput,
  condition?: ModelUserDataConditionInput | null,
};

export type CreateUserDataMutation = {
  createUserData:  {
    __typename: "UserData",
    id: string,
    user_id: string,
    theme: string | null,
    achievements: Array< string | null > | null,
    lcp_data: string | null,
    pilots: Array< string | null > | null,
    npcs: Array< string | null > | null,
    encounters: Array< string | null > | null,
    missions: Array< string | null > | null,
    active_missions: Array< string | null > | null,
    welcome_hash: string | null,
    sync_frequency: string | null,
    sync_options: string | null,
    view_options: string | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserDataMutationVariables = {
  input: UpdateUserDataInput,
  condition?: ModelUserDataConditionInput | null,
};

export type UpdateUserDataMutation = {
  updateUserData:  {
    __typename: "UserData",
    id: string,
    user_id: string,
    theme: string | null,
    achievements: Array< string | null > | null,
    lcp_data: string | null,
    pilots: Array< string | null > | null,
    npcs: Array< string | null > | null,
    encounters: Array< string | null > | null,
    missions: Array< string | null > | null,
    active_missions: Array< string | null > | null,
    welcome_hash: string | null,
    sync_frequency: string | null,
    sync_options: string | null,
    view_options: string | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserDataMutationVariables = {
  input: DeleteUserDataInput,
  condition?: ModelUserDataConditionInput | null,
};

export type DeleteUserDataMutation = {
  deleteUserData:  {
    __typename: "UserData",
    id: string,
    user_id: string,
    theme: string | null,
    achievements: Array< string | null > | null,
    lcp_data: string | null,
    pilots: Array< string | null > | null,
    npcs: Array< string | null > | null,
    encounters: Array< string | null > | null,
    missions: Array< string | null > | null,
    active_missions: Array< string | null > | null,
    welcome_hash: string | null,
    sync_frequency: string | null,
    sync_options: string | null,
    view_options: string | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetUserDataQueryVariables = {
  id: string,
};

export type GetUserDataQuery = {
  getUserData:  {
    __typename: "UserData",
    id: string,
    user_id: string,
    theme: string | null,
    achievements: Array< string | null > | null,
    lcp_data: string | null,
    pilots: Array< string | null > | null,
    npcs: Array< string | null > | null,
    encounters: Array< string | null > | null,
    missions: Array< string | null > | null,
    active_missions: Array< string | null > | null,
    welcome_hash: string | null,
    sync_frequency: string | null,
    sync_options: string | null,
    view_options: string | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserDatasQueryVariables = {
  filter?: ModelUserDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserDatasQuery = {
  listUserDatas:  {
    __typename: "ModelUserDataConnection",
    items:  Array< {
      __typename: "UserData",
      id: string,
      user_id: string,
      theme: string | null,
      achievements: Array< string | null > | null,
      lcp_data: string | null,
      pilots: Array< string | null > | null,
      npcs: Array< string | null > | null,
      encounters: Array< string | null > | null,
      missions: Array< string | null > | null,
      active_missions: Array< string | null > | null,
      welcome_hash: string | null,
      sync_frequency: string | null,
      sync_options: string | null,
      view_options: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type SyncUserDataQueryVariables = {
  filter?: ModelUserDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUserDataQuery = {
  syncUserData:  {
    __typename: "ModelUserDataConnection",
    items:  Array< {
      __typename: "UserData",
      id: string,
      user_id: string,
      theme: string | null,
      achievements: Array< string | null > | null,
      lcp_data: string | null,
      pilots: Array< string | null > | null,
      npcs: Array< string | null > | null,
      encounters: Array< string | null > | null,
      missions: Array< string | null > | null,
      active_missions: Array< string | null > | null,
      welcome_hash: string | null,
      sync_frequency: string | null,
      sync_options: string | null,
      view_options: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type OnCreateUserDataSubscription = {
  onCreateUserData:  {
    __typename: "UserData",
    id: string,
    user_id: string,
    theme: string | null,
    achievements: Array< string | null > | null,
    lcp_data: string | null,
    pilots: Array< string | null > | null,
    npcs: Array< string | null > | null,
    encounters: Array< string | null > | null,
    missions: Array< string | null > | null,
    active_missions: Array< string | null > | null,
    welcome_hash: string | null,
    sync_frequency: string | null,
    sync_options: string | null,
    view_options: string | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserDataSubscription = {
  onUpdateUserData:  {
    __typename: "UserData",
    id: string,
    user_id: string,
    theme: string | null,
    achievements: Array< string | null > | null,
    lcp_data: string | null,
    pilots: Array< string | null > | null,
    npcs: Array< string | null > | null,
    encounters: Array< string | null > | null,
    missions: Array< string | null > | null,
    active_missions: Array< string | null > | null,
    welcome_hash: string | null,
    sync_frequency: string | null,
    sync_options: string | null,
    view_options: string | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserDataSubscription = {
  onDeleteUserData:  {
    __typename: "UserData",
    id: string,
    user_id: string,
    theme: string | null,
    achievements: Array< string | null > | null,
    lcp_data: string | null,
    pilots: Array< string | null > | null,
    npcs: Array< string | null > | null,
    encounters: Array< string | null > | null,
    missions: Array< string | null > | null,
    active_missions: Array< string | null > | null,
    welcome_hash: string | null,
    sync_frequency: string | null,
    sync_options: string | null,
    view_options: string | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};
